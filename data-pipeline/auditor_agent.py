import os
import json
import time
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
from google import genai
from google.genai import types
from pymongo import MongoClient, UpdateOne

class FastAgenticAuditor:
    def __init__(self):
        self.client = MongoClient("mongodb://localhost:27017/")
        self.db = self.client["govintel"]
        self.ai_client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
        
        # PRO-TIER SETTINGS
        # Since you are on a Paid account, we can push the RPM significantly higher.
        self.MAX_WORKERS = 20  # 20 simultaneous research tasks

    def audit_task(self, commitment):
        """Individual agentic research task for one commitment."""
        commitment_id = commitment["_id"]
        title = commitment.get("title", "Unknown Promise")
        year = commitment.get("election_year", 2019)

        prompt = f"""
        Research the progress of this Indian Government promise from {year} to 2026.
        PROMISE: {commitment['description']}
        
        TASK:
        1. Search for official news, PIB, and budget milestones. [cite: 16, 18]
        2. Assign a status: 'Fulfilled', 'In Progress', 'Partially Fulfilled', or 'Stalled'. 
        3. Create a short timeline of events. [cite: 66]
        
        Return ONLY a raw JSON object:
        {{
            "status": "...",
            "summary": "1-sentence citizen-friendly summary",
            "evidence_link": "URL",
            "timeline": [{{"year": "...", "event": "..."}}],
            "impact_score": 1-10
        }}
        """

        try:
            # Using Gemini 2.0 Flash for maximum speed/cost efficiency
            response = self.ai_client.models.generate_content(
                model='gemini-2.0-flash',
                contents=[prompt],
                config=types.GenerateContentConfig(
                    tools=[types.Tool(google_search=types.GoogleSearch())],
                    temperature=0.1
                )
            )
            
            # Clean and Parse
            clean_text = response.text.replace('```json', '').replace('```', '').strip()
            report = json.loads(clean_text)
            
            print(f"✅ Finished: {title[:30]}...")
            return UpdateOne(
                {"_id": commitment_id},
                {"$set": {
                    "audit_report": report,
                    "is_audited": True,
                    "fulfillment_status": report.get("status"),
                    "last_updated": datetime.now()
                }}
            )
        except Exception as e:
            print(f"❌ Failed: {title[:30]} | Error: {str(e)[:50]}")
            return UpdateOne({"_id": commitment_id}, {"$set": {"audit_failed": True}})

    def run_production_audit(self):
        query = {"is_audited": {"$ne": True}, "audit_failed": {"$ne": True}}
        total = self.db.commitments.count_documents(query)
        print(f"🚀 Paid Account Detected. Auditing {total} commitments with 20 parallel threads...")

        while True:
            # Fetch batch
            batch = list(self.db.commitments.find(query).limit(100))
            if not batch:
                break
            
            # Run in parallel
            with ThreadPoolExecutor(max_workers=self.MAX_WORKERS) as executor:
                updates = list(executor.map(self.audit_task, batch))
            
            # Bulk save to Mongo
            if updates:
                self.db.commitments.bulk_write(updates)
                print(f"📦 Batch saved. Progress: {self.db.commitments.count_documents({'is_audited': True})}/{total + self.db.commitments.count_documents({'is_audited': True})}")

if __name__ == "__main__":
    auditor = FastAgenticAuditor()
    auditor.run_production_audit()