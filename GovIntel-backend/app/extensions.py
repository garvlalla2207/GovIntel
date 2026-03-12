from pymongo import MongoClient
import os

class DatabaseSetup:
    def __init__(self):
        self.client = None
        self.db = None

    def init_app(self, app):
        mongo_uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
        self.client = MongoClient(mongo_uri)
        self.db = self.client["govintel"]

mongo = DatabaseSetup()