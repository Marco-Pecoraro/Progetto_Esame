from flask import Flask, request, jsonify, render_template
import smtplib
import imaplib
import email
from email.mime.text import MIMEText
from email.header import decode_header
import spacy
from spacy.lang.en.stop_words import STOP_WORDS
from string import punctuation
from tensorflow.keras.models import load_model
import os

app = Flask(__name__)

# Configurazione SMTP e IMAP
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
IMAP_SERVER = 'imap.gmail.com'
IMAP_PORT = 993
EMAIL = os.getenv('EMAIL', 't4843494@gmail.com')  # Usa variabili d'ambiente per le credenziali
PASSWORD = os.getenv('PASSWORD', '!Password1234')

# Carica il modello di machine learning
model = load_model('email_classifier_model.h5')

# Carica il modello di spaCy per il preprocessing
nlp = spacy.load("en_core_web_sm")

# Funzione per il preprocessing delle email
def preprocess_email(text):
    doc = nlp(text)
    tokens = [token.lemma_.lower() for token in doc if token.text not in STOP_WORDS and token.text not in punctuation]
    return " ".join(tokens)

# Homepage
@app.route('/')
def index():
    return render_template('index.html')

# Invia email
@app.route('/send_email', methods=['POST'])
def send_email():
    data = request.get_json()
    to = data.get('to')
    subject = data.get('subject')
    body = data.get('body')

    try:
        # Crea il messaggio email
        msg = MIMEText(body)
        msg['From'] = EMAIL
        msg['To'] = to
        msg['Subject'] = subject

        # Invia l'email tramite SMTP
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL, PASSWORD)
            server.sendmail(EMAIL, to, msg.as_string())

        return jsonify({"status": "success", "message": "Email inviata con successo!"})
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

# Sincronizza le email
@app.route('/sync_emails')
def sync_emails():
    try:
        # Connettiti al server IMAP
        mail = imaplib.IMAP4_SSL(IMAP_SERVER, IMAP_PORT)
        mail.login(EMAIL, PASSWORD)
        mail.select('inbox')

        # Cerca tutte le email
        status, messages = mail.search(None, 'ALL')
        email_ids = messages[0].split()

        emails = []
        for email_id in email_ids:
            status, msg_data = mail.fetch(email_id, '(RFC822)')
            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_bytes(response_part[1])
                    subject = decode_header(msg["Subject"])[0][0]
                    if isinstance(subject, bytes):
                        subject = subject.decode()
                    from_ = msg.get("From")
                    date = msg.get("Date")
                    body = ""

                    if msg.is_multipart():
                        for part in msg.walk():
                            content_type = part.get_content_type()
                            if content_type == "text/plain":
                                body = part.get_payload(decode=True).decode()
                    else:
                        body = msg.get_payload(decode=True).decode()

                    emails.append({
                        "subject": subject,
                        "from": from_,
                        "date": date,
                        "body": body
                    })

        mail.logout()
        return jsonify(emails)
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

# Classifica le email
@app.route('/classify_email', methods=['POST'])
def classify_email():
    data = request.get_json()
    email_text = data.get('email', '')
    processed_email = preprocess_email(email_text)
    prediction = model.predict([processed_email])
    category = prediction.argmax(axis=-1)
    return jsonify({"category": int(category)})

if __name__ == '__main__':
    app.run(debug=True)