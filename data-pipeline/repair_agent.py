import os
import json
import re
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor
from google import genai
from google.genai import types
from pymongo import MongoClient, UpdateOne

class GovernanceRepairAgent:
    def __init__(self):
        self.client = MongoClient("mongodb://localhost:27017/")
        self.db = self.client["govintel"]
        self.ai_client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

    def clean_json_response(self, text):
        """Removes common AI syntax errors like trailing commas and markdown blocks."""
        # Extract only the content between the first { and last }
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if not match:
            return None
        
        json_str = match.group(0)
        # Remove illegal trailing commas before closing braces/brackets
        json_str = re.sub(r',\s*([\]}])', r'\1', json_str)
        # Clean up any remaining markdown artifacts
        json_str = json_str.replace('```json', '').replace('```', '').strip()
        return json_str

    def repair_commitment(self, commitment):
        """Retries a failed commitment with a strict formatting prompt."""
        commitment_id = commitment["_id"]
        title = commitment.get("title", "Unknown Promise")
        year = commitment.get("election_year", 2019)

        print(f"🛠 Retrying: {title[:40]}...")

        prompt = f"""
        ACT AS A RIGID DATA EXTRACTOR. 
        Research this Indian Government promise from {year}-2026: {commitment['description']}
        
        STRICT OUTPUT RULE: 
        Return ONLY valid JSON. No text before or after. No trailing commas. 
        {{
            "status": "Fulfilled/In Progress/Partially Fulfilled/Stalled",
            "summary": "1-sentence summary",
            "evidence_link": "URL",
            "timeline": [{{"year": "YYYY", "event": "..."}}],
            "impact_score": 5
        }}
        """

        try:
            response = self.ai_client.models.generate_content(
                model='gemini-2.0-flash',
                contents=[prompt],
                config=types.GenerateContentConfig(
                    tools=[types.Tool(google_search=types.GoogleSearch())],
                    temperature=0.1
                )
            )
            
            json_str = self.clean_json_response(response.text)
            if not json_str:
                raise ValueError("No JSON found in response")
                
            report = json.loads(json_str)

            return UpdateOne(
                {"_id": commitment_id},
                {"$set": {
                    "audit_report": report,
                    "is_audited": True,
                    "fulfillment_status": report.get("status"),
                    "last_updated": datetime.now(),
                    "audit_failed": False # Clear the failure flag
                }}
            )
        except Exception as e:
            print(f"❌ Permanent Failure for {title[:20]}: {str(e)[:50]}")
            return None

    def run_repair(self):
        # Target only the 11 failed records
        query = {"audit_failed": True}
        failed_items = list(self.db.commitments.find(query))
        
        if not failed_items:
            print("🎉 No failed audits found in the database.")
            return

        print(f"🚀 Repairing {len(failed_items)} commitments...")

        with ThreadPoolExecutor(max_workers=5) as executor:
            updates = [u for u in executor.map(self.repair_commitment, failed_items) if u]

        if updates:
            self.db.commitments.bulk_write(updates)
            print(f"✅ Successfully repaired {len(updates)} records.")

if __name__ == "__main__":
    agent = GovernanceRepairAgent()
    agent.run_repair()