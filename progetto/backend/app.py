from flask import Flask, jsonify, request
from email_service import EmailService
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()

app = Flask(__name__)
email_service = EmailService()

@app.route('/api/emails', methods=['GET'])
def get_emails():
    category = request.args.get('category', 'inbox')
    try:
        emails = email_service.get_emails(category)
        return jsonify({
            "status": "success",
            "data": emails,
            "last_sync": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/sync', methods=['POST'])
def sync_emails():
    try:
        result = email_service.sync_emails()
        return jsonify({
            "status": "success",
            "count": result["count"],
            "new_emails": result["new_emails"]
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)