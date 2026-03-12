import os
from google import genai
from app.repositories.commitment_repo import CommitmentRepository

class AnalyticsService:
    def __init__(self):
        self.repo = CommitmentRepository()

    def fetch_dashboard_stats(self):
        """Formats the raw aggregation into clean dashboard metrics."""
        raw_stats = self.repo.get_stats_aggregation()
        
        formatted_stats = {
            "total_active": 0,
            "fulfilled": 0,
            "stalled": 0,
            "in_progress": 0,
            "partially_fulfilled": 0
        }

        for stat in raw_stats:
            status = stat.get("_id")
            count = stat.get("count", 0)
            
            if not status: 
                continue
                
            status_clean = str(status).strip().lower()

            if status_clean == "fulfilled":
                formatted_stats["fulfilled"] += count
            elif status_clean == "stalled":
                formatted_stats["stalled"] += count
            elif status_clean == "partially fulfilled":
                formatted_stats["partially_fulfilled"] += count
            else:
                formatted_stats["in_progress"] += count

        formatted_stats["total_active"] = (
            formatted_stats["fulfilled"] + 
            formatted_stats["stalled"] + 
            formatted_stats["in_progress"] + 
            formatted_stats["partially_fulfilled"]
        )

        return formatted_stats

    def fetch_commitments_for_ui(self, limit=50, skip=0):
        """Cleans MongoDB ObjectIds for JSON serialization."""
        data = self.repo.get_all_audited(limit, skip)
        for item in data:
            item["_id"] = str(item["_id"])
            if "manifesto_id" in item:
                item["manifesto_id"] = str(item["manifesto_id"])
        return data

    def generate_ai_briefing(self):
        """Generates a dynamic text briefing based on real-time DB stats and specific policies."""
        try:
            api_key = os.environ.get("GEMINI_API_KEY")
            if not api_key:
                raise ValueError("GEMINI_API_KEY is missing from .env file")

            ai_client = genai.Client(api_key=api_key)
            stats = self.fetch_dashboard_stats()
            
            # --- NEW: Fetch actual commitment titles to make the AI sound smart ---
            from app.extensions import mongo
            
            # Grab 2 fulfilled and 2 stalled promises directly from the DB
            fulfilled_docs = list(mongo.db.commitments.find({"audit_report.status": "Fulfilled"}, {"title": 1}).limit(2))
            stalled_docs = list(mongo.db.commitments.find({"audit_report.status": "Stalled"}, {"title": 1}).limit(2))
            
            f_titles = [doc.get("title", "Unknown") for doc in fulfilled_docs]
            s_titles = [doc.get("title", "Unknown") for doc in stalled_docs]

            prompt = f"""
            Act as an elite Political Data Analyst. Write a brief, hard-hitting executive summary of the current governance landscape.
            
            Context Data:
            - Total Tracked: {stats.get('total_active', 0)}
            - Fulfilled Ratio: {stats.get('fulfilled', 0)} out of {stats.get('total_active', 0)}
            - Notable Fulfilled Successes: {', '.join(f_titles)}
            - Notable Stalled Bottlenecks: {', '.join(s_titles)}
            
            Write exactly three short sections using Markdown. DO NOT just list numbers. 
            
            ### 📊 Strategic Overview
            (Analyze the overall completion rate. Explain what this velocity means for government efficiency.)
            
            ### 🚀 Legislative Momentum 
            (Name-drop the specific 'Fulfilled Successes' provided. Explain why passing these specific policies matters.)
            
            ### ⚠️ Critical Bottlenecks
            (Name-drop the specific 'Stalled Bottlenecks' provided. Warn about the impact of these delays.)
            
            Tone: Professional, authoritative, journalistic. NO robotic intros.
            """

            response = ai_client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt
            )
            return response.text
            
        except Exception as e:
            print(f"Backend AI Error: {str(e)}") 
            return f"### ⚠️ AI Generation Failed\n**Error Details:** {str(e)}"

    def fetch_high_priority_for_ui(self):
        """Formats the mixed priority list for the React radial progress component."""
        docs = self.repo.get_mixed_priority_implementations()
        formatted = []
        
        for doc in docs:
            audit = doc.get("audit_report", {})
            status = audit.get("status", "Unknown")
            evidence_link = audit.get("evidence_link", "")
            
            # Map the AI status to a percentage and UI Level
            if status == "Fulfilled":
                progress = 85
                level = "Advanced"
            elif status == "Partially Fulfilled":
                progress = 65
                level = "Advanced"
            elif status == "In Progress":
                progress = 45
                level = "In Progress"
            else:
                progress = 10
                level = "Stalled"
            
            # Extract actual event text from the AI timeline
            timeline = audit.get("timeline", [])
            tags = []
            for item in timeline[-2:]: # Grab the 2 most recent timeline events
                year = item.get("year", "")
                event_snippet = str(item.get("event", ""))[:25] + "..." if item.get("event") else "Status Updated"
                tags.append(f"{year}: {event_snippet}" if year else event_snippet)
                
            if not tags:
                tags = ["No Active Legislation"] if status == "Stalled" else ["Pending Review"]
            
            formatted.append({
                "id": str(doc["_id"]),
                "title": doc.get("title", "Unknown Initiative"),
                "progress": progress,
                "level": level,
                "tags": tags,
                "evidence_link": evidence_link
            })
            
        return formatted