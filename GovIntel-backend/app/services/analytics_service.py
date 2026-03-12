import os
from google import genai
from app.repositories.commitment_repo import CommitmentRepository

class AnalyticsService:
    def __init__(self):
        self.repo = CommitmentRepository()

    def fetch_dashboard_stats(self, term=None):
        """Formats the raw aggregation into clean dashboard metrics filtered by term."""
        # Pass term to repository for filtering
        raw_stats = self.repo.get_stats_aggregation(term=term)
        
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

    def fetch_commitments_for_ui(self, limit=50, skip=0, term=None):
        """Fetches commitments filtered by term and cleans IDs for JSON."""
        data = self.repo.get_all_audited(limit=limit, skip=skip, term=term)
        for item in data:
            item["_id"] = str(item["_id"])
            if "manifesto_id" in item:
                item["manifesto_id"] = str(item["manifesto_id"])
        return data

    def generate_ai_briefing(self, term=None):
        """Generates dynamic AI briefing based on filtered stats and policies."""
        try:
            api_key = os.environ.get("GEMINI_API_KEY")
            if not api_key:
                raise ValueError("GEMINI_API_KEY is missing from .env file")

            ai_client = genai.Client(api_key=api_key)
            
            # Fetch stats for the specific term
            stats = self.fetch_dashboard_stats(term=term)
            
            from app.extensions import mongo
            
            # Match query for term-specific examples
            match_query = {"audit_report.status": "Fulfilled"}
            stalled_query = {"audit_report.status": "Stalled"}
            if term and term != "All Terms":
                match_query["term"] = int(term)
                stalled_query["term"] = int(term)

            fulfilled_docs = list(mongo.db.commitments.find(match_query, {"title": 1}).limit(2))
            stalled_docs = list(mongo.db.commitments.find(stalled_query, {"title": 1}).limit(2))
            
            f_titles = [doc.get("title", "Unknown") for doc in fulfilled_docs]
            s_titles = [doc.get("title", "Unknown") for doc in stalled_docs]

            term_context = f"for the {term} election term" if term and term != "All Terms" else "across all recorded terms"

            prompt = f"""
            Act as an elite Political Data Analyst. Write a hard-hitting executive summary {term_context}.
            
            Context Data:
            - Total Tracked: {stats.get('total_active', 0)}
            - Fulfilled Ratio: {stats.get('fulfilled', 0)} out of {stats.get('total_active', 0)}
            - Notable Fulfilled Successes: {', '.join(f_titles) if f_titles else 'None found for this period'}
            - Notable Stalled Bottlenecks: {', '.join(s_titles) if s_titles else 'None found for this period'}
            
            Write exactly three short sections using Markdown.
            
            ### 📊 Strategic Overview
            ### 🚀 Legislative Momentum 
            ### ⚠️ Critical Bottlenecks
            
            Tone: Professional and authoritative. Focus strictly on the data provided.
            """

            response = ai_client.models.generate_content(
                model='gemini-2.0-flash', # Updated to latest stable
                contents=prompt
            )
            return response.text
            
        except Exception as e:
            print(f"Backend AI Error: {str(e)}") 
            return f"### ⚠️ AI Generation Failed\n**Error Details:** {str(e)}"

    def fetch_high_priority_for_ui(self, term=None):
        """Formats mixed priority list filtered by term."""
        docs = self.repo.get_mixed_priority_implementations(term=term)
        formatted = []
        
        for doc in docs:
            audit = doc.get("audit_report", {})
            status = audit.get("status", "Unknown")
            evidence_link = audit.get("evidence_link", "")
            
            if status == "Fulfilled":
                progress, level = 85, "Advanced"
            elif status == "Partially Fulfilled":
                progress, level = 65, "Advanced"
            elif status == "In Progress":
                progress, level = 45, "In Progress"
            else:
                progress, level = 10, "Stalled"
            
            timeline = audit.get("timeline", [])
            tags = []
            for item in timeline[-2:]:
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

    def fetch_intelligence_feed(self, term=None):
        """Creates a diversified feed filtered by term."""
        commitments = self.repo.get_all_audited(limit=20, term=term)
        feed = []
        
        for doc in commitments:
            audit = doc.get("audit_report", {})
            timeline = audit.get("timeline", [])
            status = audit.get("status", "Updated")
            
            if timeline:
                latest_event = timeline[-1] 
                feed.append({
                    "id": str(doc['_id']),
                    "year": latest_event.get("year", "2024"),
                    "title": doc.get("title"),
                    "description": latest_event.get("event"),
                    "status": status,
                    "urgency": "high" if status == "Stalled" else "normal" 
                })
        
        feed.sort(key=lambda x: x['year'], reverse=True)
        return feed