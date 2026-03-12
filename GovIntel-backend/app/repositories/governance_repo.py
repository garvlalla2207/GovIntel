import os
import json
from google import genai
from app.extensions import mongo

class GovernanceRepository:
    @staticmethod
    def get_network_data(term=None):
        api_key = os.environ.get("GEMINI_API_KEY")
        client = genai.Client(api_key=api_key)

        # Fetch relevant records for this term
        query = {"manifesto_year": int(term)} if term and term != "All Terms" else {}
        db_docs = list(mongo.db.commitments.find(query, {"title": 1, "sector": 1, "summary": 1, "status": 1}))
        
        context = [{"id": str(d["_id"]), "title": d["title"], "sector": d["sector"], "status": d["status"]} for d in db_docs]

        prompt = f"""
        Act as a Data Architect. Curate exactly 15-20 nodes for the year {term} from this data: {json.dumps(context)}
        
        STRUCTURE:
        - 1 Core Node (Manifesto {term}) at (400, 300).
        - 7-8 Promise Nodes (type: 'promise') on a circle (Radius 180).
        - 7-8 Bill Nodes (type: 'passed' or 'stalled') linked to promises on a circle (Radius 340).
        
        Return ONLY valid JSON:
        {{
            "nodes": [{{ "id": "core", "x": 400, "y": 300, "type": "core", "cluster": "all", "label": "Manifesto {term}", "details": "Summary...", "status": "Active" }}, ...],
            "edges": [{{ "id": "e1", "source": "core", "target": "node_id" }}, ...]
        }}
        """

        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
            config={'response_mime_type': 'application/json'}
        )
        return json.loads(response.text)