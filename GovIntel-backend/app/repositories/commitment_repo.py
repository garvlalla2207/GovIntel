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
            {"$group": {"_id": "$fulfillment_status", "count": {"$sum": 1}}}
        ]
        return list(mongo.db.commitments.aggregate(pipeline))