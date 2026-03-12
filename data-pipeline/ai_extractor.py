import json
import google.generativeai as genai
from manifesto import Manifesto
from government_announcement import GovernmentAnnouncement

class AIGovernanceExtractor:
    
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        # Using Gemini 1.5 Pro as it handles large contexts and strict JSON schemas perfectly
        self.model = genai.GenerativeModel('gemini-1.5-pro')

    def extract_manifesto_data(self, raw_text: str, party: str, year: int, source: str) -> str:
        prompt = f"""
        You are an expert data extraction algorithm. I am providing you with the raw text from an election manifesto.
        Read the text carefully and extract every single promise, policy, and guarantee mentioned.
        
        Context for this extraction:
        Party Name: {party}
        Election Year: {year}
        Source Document: {source}
        Region: National
        
        Return the extracted data strictly matching the provided JSON schema. Do not include any other text or markdown.
        """
        
        try:
            response = self.model.generate_content(
                contents=[prompt, raw_text],
                generation_config=genai.GenerationConfig(
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
            response = self.model.generate_content(
                contents=[prompt, raw_text],
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=GovernmentAnnouncement,
                    temperature=0.1
                )
            )
            return response.text
        except Exception as e:
            return json.dumps({"error": f"Announcement extraction failed: {str(e)}"})