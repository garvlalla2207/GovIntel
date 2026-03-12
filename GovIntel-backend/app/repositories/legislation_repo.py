from app.extensions import mongo

class LegislationRepository:
    @staticmethod
    def get_all_bills():
        return list(mongo.db.legislative_documents.find().sort("introduced_date", -1))

    @staticmethod
    def get_bill_by_id(bill_id):
        from bson import ObjectId
        return mongo.db.legislative_documents.find_one({"_id": ObjectId(bill_id)})