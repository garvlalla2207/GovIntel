from pymongo import MongoClient

def verify_data():
    try:
        # Connect to MongoDB
        client = MongoClient("mongodb://localhost:27017/")
        db = client["govintel"]
        
        # Search for the document
        query = {"title": {"$regex": "Ram Temple", "$options": "i"}}
        doc = db.commitments.find_one(query)
        
        if doc:
            print("-" * 50)
            print(f"✅ FOUND DOCUMENT: {doc.get('title')}")
            
            # Navigate the nested dictionary safely
            audit_report = doc.get("audit_report", {})
            link = audit_report.get("evidence_link", "LINK NOT FOUND IN DICT")
            
            print(f"🔗 URL IN DB: {link}")
            print("-" * 50)
            
            if "article67810488.ece" in link:
                print("🌟 SUCCESS: The DB has the correct updated link.")
            else:
                print("❌ FAILURE: The DB still has the old or broken link.")
        else:
            print("❓ No document found matching 'Ram Temple'. Check your collection content.")
            
    except Exception as e:
        print(f"🔥 ERROR CONNECTING: {e}")

if __name__ == "__main__":
    verify_data()