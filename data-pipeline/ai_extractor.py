import json
import google.generativeai as genai
from manifesto import Manifesto

class AIGovernanceExtractor:
    
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    def extract_manifesto_data(self, raw_text: str, party: str, year: int, source: str) -> str:
        prompt = f"""
        You are an expert data extraction algorithm. I am providing you with the raw text from an election manifesto.
        Read the text carefully and extract every single promise, policy, and guarantee mentioned.
        
        Context for this extraction:
        Party Name: {party}
        Election Year: {year}
        Source Document: {source}
        Region: National
        
        Return the extracted data strictly matching the provided JSON schema. Do not include any other text.
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
            return json.dumps({"error": f"Extraction failed: {str(e)}"})