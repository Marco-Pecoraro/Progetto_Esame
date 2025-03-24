from services.mongodb import MongoDB

class EmailModel:
    def __init__(self):
        self.db = MongoDB().get_db()

    def save_email(self, email_data):
        self.db.emails.insert_one(email_data)

    def get_emails(self, category=None):
        query = {"category": category} if category else {}
        return list(self.db.emails.find(query).sort("date", -1).limit(50))