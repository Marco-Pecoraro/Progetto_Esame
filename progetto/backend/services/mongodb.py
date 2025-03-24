from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

class MongoDB:
    def __init__(self):
        self.client = MongoClient(
            f"mongodb+srv://{os.getenv('MONGO_USER')}:{os.getenv('MONGO_PWD')}@"
            f"{os.getenv('MONGO_CLUSTER')}.mongodb.net/?retryWrites=true&w=majority"
        )
        self.db = self.client[os.getenv('MONGO_DB_NAME')]

    def get_db(self):
        return self.db