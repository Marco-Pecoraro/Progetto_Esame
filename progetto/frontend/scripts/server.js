// file che probabilmente finisce nel cestino!

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Static files
app.use(express.static(path.join(__dirname, "../")));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});

// Simulazione di email iniziali
let emails = [
    {
        id: 1,
        sender: "manager@company.com",
        subject: "Meeting Update",
        body: "The meeting is rescheduled to 3 PM tomorrow.",
        category: "arriving",
    },
    {
        id: 2,
        sender: "hr@company.com",
        subject: "Policy Update",
        body: "Please review the new company policies attached.",
        category: "important",
    },
    {
        id: 3,
        sender: "client@business.com",
        subject: "Project Proposal",
        body: "Here's the proposal for our next project.",
        category: "meetings",
    },
];

// Funzione per categorizzare email
function categorizeEmail(email) {
    const keywords = {
        meetings: ["meeting", "schedule", "appointment", "zoom", "call"],
        important: ["urgent", "important", "priority", "follow up"],
        bin: ["unsubscribe", "advertisement", "promo", "sale"],
    };

    const emailText = email.body.toLowerCase(); // Correzione: usa 'body'

    if (keywords.meetings.some((word) => emailText.includes(word))) {
        return "meetings";
    } else if (keywords.important.some((word) => emailText.includes(word))) {
        return "important";
    } else if (keywords.bin.some((word) => emailText.includes(word))) {
        return "bin";
    } else {
        return "arriving";
    }
}

// Endpoint per ottenere tutte le email
app.get("/api/emails", (req, res) => {
    res.json(emails);
});

// Endpoint per aggiungere una nuova email
app.post("/api/emails", (req, res) => {
    const email = req.body;
    email.category = categorizeEmail(email);
    email.id = emails.length + 1; // Genera ID univoco
    emails.push(email);
    res.status(201).json(email);
});

// Endpoint per aggiornare la categoria di un'email
app.put("/api/emails/:id", (req, res) => {
    const emailId = parseInt(req.params.id);
    const { category } = req.body;

    const email = emails.find((email) => email.id === emailId);
    if (email) {
        email.category = category;
        res.json({ message: "Categoria aggiornata", email });
    } else {
        res.status(404).json({ message: "Email non trovata" });
    }
});

// Gestione placeholder per '/classify-email' e '/create-event'
app.post("/classify-email", (req, res) => {
    res.json({ success: true, category: "arriving" });
});

app.post("/create-event", (req, res) => {
    res.json({ success: true, message: "Evento creato su Google Calendar (simulato)." });
});

// Start del server
app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});
