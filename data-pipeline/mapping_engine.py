import os
import json
from bson.objectid import ObjectId
from pymongo import MongoClient
import google.generativeai as genai
from pydantic import BaseModel, Field
from typing import List, Optional

# 1. The Pydantic Schema for our Relationship Data
class PolicyMatch(BaseModel):
    document_id: str = Field(description="The exact ID of the matching legislative document or announcement.")
    confidence_score: int = Field(description="Score from 0 to 100 on how well this document fulfills the promise.")
    reasoning: str = Field(description="A 1-2 sentence explanation of why this document connects to the promise.")

class ProgressEvaluation(BaseModel):
    overall_status: str = Field(description="Must be one of: 'Fulfilled', 'In Progress', or 'No Progress'")
    matches: List[PolicyMatch] = Field(description="List of documents that show progress. Empty if no progress.")

class MappingEngine:
    def __init__(self):
        # 1. Connect to Local MongoDB
        self.client = MongoClient("mongodb://localhost:27017/")
        self.db = self.client["govintel"]
        
        # 2. Connect to Gemini
        api_key = os.environ.get("GEMINI_API_KEY")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-pro')

    def evaluate_promise(self, promise_id: str):
        """Finds a promise, fetches potential matching policies, and uses AI to map them."""
        
        # 1. Fetch the specific promise from MongoDB
        promise = self.db.commitments.find_one({"_id": ObjectId(promise_id)})
        if not promise:
            print("Promise not found!")
            return

        print(f"Evaluating Promise: {promise['title']} (Sector: {promise['sector']})")

        # 2. Fetch candidate documents from the SAME sector to keep the context window small and efficient
        # In a real app, you'd fetch from your 'legislative_documents' or 'announcements' collections
        # For this engine, we pull recent announcements
        candidates = list(self.db.announcements.find({})) 
        
        if not candidates:
            print("No legislative documents available to compare against.")
            return

        # Prepare the candidate data for the AI to read
        candidate_text = ""
        for doc in candidates:
            # We pass the stringified MongoDB _id so the AI can return it to us!
            candidate_text += f"ID: {str(doc['_id'])} | Title: {doc['title']} | Summary: {doc['summary']}\n"

        # 3. The Mapping Prompt
        prompt = f"""
        You are an expert political analyst. I am giving you a political promise from an election manifesto, 
        and a list of recent legislative documents/announcements. 
        
        Your job is to map any relevant documents to the promise. If a document shows action being taken on the promise, 
        link it. If none of the documents relate to the promise, mark the overall status as 'No Progress'.
        
        --- THE PROMISE ---
        Title: {promise['title']}
        Description: {promise['description']}
        Target: {promise.get('target_metric', 'None')}
        
        --- RECENT LEGISLATION / ANNOUNCEMENTS ---
        {candidate_text}
        """

        try:
            # 4. Ask Gemini to evaluate the mapping and return strict JSON
            response = self.model.generate_content(
                contents=[prompt],
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=ProgressEvaluation,
                    temperature=0.1
                )
            )
            
            evaluation = json.loads(response.text)
            
            # 5. Save the relationship back into MongoDB
            mapping_record = {
                "promise_id": ObjectId(promise_id),
                "overall_status": evaluation["overall_status"],
                "matches": evaluation["matches"]
            }
            
            # We store this in a new collection called 'promise_tracking'
            self.db.promise_tracking.insert_one(mapping_record)
            
            print(f"Mapping Complete! Status: {evaluation['overall_status']}")
            print(f"Found {len(evaluation['matches'])} related policy documents.")
            
        except Exception as e:
            print(f"Mapping engine failed: {e}")

# Quick test script
if __name__ == "__main__":
    engine = MappingEngine()
    
    # Grab the very first promise in your database to test it
    first_promise = engine.db.commitments.find_one()
    
    if first_promise:
        engine.evaluate_promise(str(first_promise["_id"]))
    else:
        print("Please run your pipeline first to get some commitments in the database!")