import json
from google import genai
from google.genai import types
from manifesto import Manifesto
from government_announcement import GovernmentAnnouncement
# If you created one for Objective 3:
from parliamentary_record import ParliamentaryRecord

class AIGovernanceExtractor:
    
    def __init__(self, api_key: str):
        # NEW SDK: We initialize a Client object instead of genai.configure
        self.client = genai.Client(api_key=api_key)
        # Upgraded to the blazing-fast Gemini 2.5 Flash
        self.model_id = 'gemini-2.5-flash'

    def extract_manifesto_data(self, raw_text: str, party: str, year: int, source: str) -> str:
        prompt = f"""
        ACT AS A DATA MINER. I am providing text from the {party} {year} manifesto.
        
        TASK: Extract EVERY bullet point, promise, or goal. 
        Even if it is a general statement like "We will improve roads", extract it.
        
        CRITICAL: 
        - If the text contains a Table of Contents, ignore it.
        - Focus on sections regarding Economy, Agriculture, Healthcare, and Infrastructure.
        - Ensure the 'description' field is long and detailed.
        
        Return ONLY valid JSON.
        """
        
        try:
            # NEW SDK: Updated generation syntax
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=[prompt, raw_text],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=Manifesto,
                    temperature=0.1
                )
            )
            return response.text
        except Exception as e:
            return json.dumps({"error": f"Manifesto extraction failed: {str(e)}"})

    def extract_announcement_data(self, raw_text: str, source_url: str) -> str:
        prompt = f"""
        You are an expert data extraction algorithm. I am providing you with the raw text from a government press release, news article, or official announcement.
        Read the text carefully and extract the core policy updates, announcements, or governance actions.
        
        Context for this extraction:
        Source URL: {source_url}
        
        Return the extracted data strictly matching the provided JSON schema. Do not include any other text or markdown.
        """
        
        try:
            # NEW SDK: Updated generation syntax
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=[prompt, raw_text],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=GovernmentAnnouncement,
                    temperature=0.1
                )
            )
            return response.text
        except Exception as e:
            return json.dumps({"error": f"Announcement extraction failed: {str(e)}"})
        

    def extract_legislative_data(self, raw_text: str, source_url: str) -> str:
        prompt = f"""
        You are an expert legal analyst. I am providing you with the text of a legislative bill or parliamentary record.
        Your job is to:
        1. Simplify the complex legal jargon into an easy-to-understand summary for common citizens.
        2. Identify the key provisions and status of the document.
        
        Context:
        Source URL: {source_url}
        
        Return the extracted data strictly matching the provided JSON schema.
        """
        
        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=[prompt, raw_text],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=ParliamentaryRecord,
                    temperature=0.1
                )
            )
            return response.text
        except Exception as e:
            return json.dumps({"error": f"Legislative extraction failed: {str(e)}"})