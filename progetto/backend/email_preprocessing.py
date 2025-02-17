import spacy
from spacy.lang.en.stop_words import STOP_WORDS
from string import punctuation
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

from flask import Flask, request, jsonify

app = Flask(__name__)

# Preprocessing email
nlp = spacy.load("en_core_web_sm")

def preprocess_email(text):
    doc = nlp(text)
    tokens = [token.lemma_.lower() for token in doc if token.text not in STOP_WORDS and token.text not in punctuation]
    return " ".join(tokens)

# API Endpoint per classificare email
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