import os
import json
from pymongo import MongoClient
from bson.objectid import ObjectId

class MongoRepository:
    """
    Handles all database operations for the GovIntel platform.
    Connects to local MongoDB and manages structured governance data.
    """
    
    def __init__(self):
        # Establish connection to the local MongoDB service
        # Defaulting to localhost:27017 as per Homebrew installation
        self.mongo_uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
        self.client = MongoClient(self.mongo_uri)
        
        # Access the main database for the project
        self.db = self.client["govintel"]
        
        # Explicitly define collections for different data types
        self.manifestos_collection = self.db["manifestos"]
        self.commitments_collection = self.db["commitments"]
        self.announcements_collection = self.db["announcements"]
        self.legislative_docs_collection = self.db["legislative_documents"]

    def store_manifesto(self, manifesto_json_str: str):
        try:
            data = json.loads(manifesto_json_str)
            found_count = len(data.get("commitments", []))
            print(f"--- AI Extracted {found_count} promises from this chunk ---")
            
            # Check if this specific manifesto already exists in the DB
            query = {
                "party_name": data.get("party_name"),
                "election_year": data.get("election_year")
            }
            
            # Use find_one_and_update with upsert=True
            # This ensures we only ever have ONE manifesto header per party/year
            manifesto_result = self.manifestos_collection.find_one_and_update(
                query,
                {"$set": {
                    "source_url": data.get("source_url"),
                    "region": "National"
                }},
                upsert=True,
                return_document=True # This gives us the ID even if it was just created
            )
            
            parent_id = manifesto_result.get("_id")

            commitments_list = data.get("commitments", [])
            processed_commitments = []
            
            for item in commitments_list:
                # To prevent duplicate commitments from overlapping chunks:
                # We check if a commitment with this exact description already exists
                existing = self.commitments_collection.find_one({
                    "manifesto_id": parent_id,
                    "description": item.get("description")
                })
                
                if not existing:
                    commitment_entry = {
                        "manifesto_id": parent_id,
                        "title": item.get("title"),
                        "description": item.get("description"),
                        "sector": item.get("sector"),
                        "governance_domain": item.get("governance_domain"),
                        "is_measurable": item.get("is_measurable"),
                        "target_metric": item.get("target_metric"),
                        "status": "Proposed"
                    }
                    processed_commitments.append(commitment_entry)
            
            if processed_commitments:
                self.commitments_collection.insert_many(processed_commitments)
                print(f"✅ Added {len(processed_commitments)} NEW commitments to {data.get('party_name')}.")
            else:
                print(f"ℹ️ No new unique commitments found in this chunk for {data.get('party_name')}.")
                
        except Exception as e:
            print(f"Database sync failed: {str(e)}")

    def store_announcement(self, announcement_json_str: str):
        """
        Takes the raw JSON string for a Government Announcement 
        and stores it in the announcements collection.
        """
        print("Starting Database Insertion for Government Announcement...")
        
        try:
            # Step 1: Parse JSON
            announcement_data = json.loads(announcement_json_str)
            
            # Step 2: Insert into MongoDB
            result = self.announcements_collection.insert_one(announcement_data)
            
            print(f"Success: Stored Announcement '{announcement_data.get('title')}' with DB ID: {result.inserted_id}")
            
        except Exception as e:
            print(f"Failed to save announcement: {str(e)}")

    def store_legislative_document(self, doc_json_str: str):
        """
        Stores structured legislative records like Bills or Parliamentary Debates.
        """
        print("Starting Database Insertion for Legislative Document...")
        
        try:
            doc_data = json.loads(doc_json_str)
            result = self.legislative_docs_collection.insert_one(doc_data)
            print(f"Success: Stored Legislative Doc '{doc_data.get('title')}' with DB ID: {result.inserted_id}")
            
        except Exception as e:
            print(f"Failed to save legislative document: {str(e)}")