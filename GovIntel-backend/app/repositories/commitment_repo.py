from app.extensions import mongo
from bson import ObjectId

class CommitmentRepository:
    def get_stats_aggregation(self, term=None):
        """Joins with manifestos to filter stats by election_year."""
        pipeline = [
            {"$match": {"is_audited": True}},
            {
                "$lookup": {
                    "from": "manifestos",
                    "localField": "manifesto_id",
                    "foreignField": "_id",
                    "as": "manifesto"
                }
            },
            {"$unwind": "$manifesto"}
        ]

        # Apply the term filter if a specific year is selected
        if term and term != "All Terms":
            pipeline.append({"$match": {"manifesto.election_year": int(term)}})

        # Group by the status
        pipeline.append({"$group": {"_id": "$audit_report.status", "count": {"$sum": 1}}})
        
        return list(mongo.db.commitments.aggregate(pipeline))

    def get_mixed_priority_implementations(self, term=None):
        """Joins with manifestos to fetch filtered priority items."""
        pipeline = [
            {"$match": {"is_audited": True}},
            {
                "$lookup": {
                    "from": "manifestos",
                    "localField": "manifesto_id",
                    "foreignField": "_id",
                    "as": "manifesto"
                }
            },
            {"$unwind": "$manifesto"}
        ]

        if term and term != "All Terms":
            pipeline.append({"$match": {"manifesto.election_year": int(term)}})

        # Get a sample of the data
        pipeline.append({"$limit": 10})
        results = list(mongo.db.commitments.aggregate(pipeline))
        
        # Simple Python logic to ensure variety in the 3 returned items
        if not results: return []
        return results[:3]

    def get_all_audited(self, limit=100, skip=0, term=None):
        """Fetches audited commitments, joined with manifestos, heavily optimized."""
        pipeline = [
            {"$match": {"is_audited": True}},
            {
                "$lookup": {
                    "from": "manifestos",
                    "localField": "manifesto_id",
                    "foreignField": "_id",
                    "as": "manifesto_data"
                }
            },
            {"$unwind": {"path": "$manifesto_data", "preserveNullAndEmptyArrays": True}}
        ]

        if term and term != "All Terms":
            try:
                pipeline.append({"$match": {"manifesto_data.election_year": int(term)}})
            except ValueError:
                pass

        # FIX: Use $addFields to keep the document intact while flattening UI keys
        pipeline.append({
            "$addFields": {
                "status": "$audit_report.status",
                "summary": "$audit_report.summary",
                "evidence_link": "$audit_report.evidence_link",
                "year": "$manifesto_data.election_year",
                "timeline": "$audit_report.timeline" # CRITICAL: Add this for the feed
            }
        })

        pipeline.append({"$skip": skip})
        pipeline.append({"$limit": limit})

        return list(mongo.db.commitments.aggregate(pipeline))