import imaplib
import email
from email.header import decode_header
from mongodb import MongoDB
from dotenv import load_dotenv
import os

load_dotenv()

class EmailService:
    def __init__(self):
        self.db = MongoDB().db
    
    def sync_emails(self):
        with imaplib.IMAP4_SSL('imap.gmail.com') as mail:
            mail.login(os.getenv('EMAIL_USER'), os.getenv('EMAIL_PASSWORD'))
            mail.select('inbox')
            _, messages = mail.search(None, 'ALL')
            
            for num in messages[0].split()[-10:]:  # Ultime 10 email
                _, data = mail.fetch(num, '(RFC822)')
                self._save_email(data[0][1])

    def _save_email(self, raw_email):
        msg = email.message_from_bytes(raw_email)
        self.db.emails.insert_one({
            "subject": decode_header(msg["Subject"])[0][0],
            "from": msg["From"],
            "date": msg["Date"],
            "body": self._extract_body(msg)[:100] + "..."
        })

    def _extract_body(self, msg):
        if msg.is_multipart():
            for part in msg.walk():
                if part.get_content_type() == "text/plain":
                    return part.get_payload(decode=True).decode()
        return msg.get_payload(decode=True).decode()

    def get_emails(self, category='inbox'):
        return list(self.db.emails.find({}).sort("date", -1).limit(50))