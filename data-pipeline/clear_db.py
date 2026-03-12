from pymongo import MongoClient

def reset_database():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["govintel"]
    
    # List of collections to clear
    collections = ["manifestos", "commitments", "announcements", "legislative_documents"]
    
    print("--- 🗑️ Cleaning GovIntel Database ---")
    for col in collections:
        count = db[col].count_documents({})
        db[col].delete_many({})
        print(f"Deleted {count} documents from '{col}'")
    
    print("Database is now clean.")

if __name__ == "__main__":
    confirm = input("Are you sure you want to delete all data? (y/n): ")
    if confirm.lower() == 'y':
        reset_database()