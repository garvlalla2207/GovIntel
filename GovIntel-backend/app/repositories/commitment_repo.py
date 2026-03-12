from app.extensions import mongo

class CommitmentRepository:
    def get_all_audited(self, limit=50, skip=0):
        """Fetches a paginated list of audited commitments."""
        cursor = mongo.db.commitments.find({"is_audited": True}).skip(skip).limit(limit)
        return list(cursor)

    def get_stats_aggregation(self):
        """Runs the MongoDB aggregation for the dashboard pie charts."""
        pipeline = [
            {"$match": {"is_audited": True}},
            {"$group": {"_id": "$audit_report.status", "count": {"$sum": 1}}} # Make sure it matches your DB schema
        ]
        return list(mongo.db.commitments.aggregate(pipeline))

    def get_mixed_priority_implementations(self):
        """Fetches 3 commitments with different statuses for the dashboard highlight."""
        # FIX: Removed 'self.' from mongo.db
        advanced = mongo.db.commitments.find_one({"is_audited": True, "audit_report.status": "Fulfilled"})
        in_progress = mongo.db.commitments.find_one({"is_audited": True, "audit_report.status": "In Progress"})
        stalled = mongo.db.commitments.find_one({"is_audited": True, "audit_report.status": "Stalled"})
        
        results = [doc for doc in [advanced, in_progress, stalled] if doc]
        
        # If we couldn't find exactly one of each, pad the list to ensure we have 3 items
        if len(results) < 3:
            needed = 3 - len(results)
            # Fetch a few extra to fill the gaps, making sure we don't duplicate
            existing_ids = [doc["_id"] for doc in results]
            extras = mongo.db.commitments.find({
                "is_audited": True, 
                "_id": {"$nin": existing_ids}
            }).limit(needed)
            results.extend(list(extras))
            
        return results[:3]