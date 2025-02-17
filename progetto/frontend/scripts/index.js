// Funzione per caricare le email dal server
async function fetchEmails() {
    try {
        const response = await fetch("/api/emails");
        const emails = await response.json();
        displayEmails(emails);
    } catch (error) {
        console.error("Errore nel caricamento delle email:", error);
    }
}

// Funzione per inviare una nuova email al server
async function addEmail(email) {
    try {
        const response = await fetch("/api/emails", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(email),
        });
        const newEmail = await response.json();
        console.log("Nuova email aggiunta:", newEmail);
        fetchEmails();
    } catch (error) {
        console.error("Errore nell'aggiunta della nuova email:", error);
    }
}

// Funzione per visualizzare le email sul frontend
function displayEmails(emails) {
    const categories = ["arriving", "important", "meetings", "bin"];
    categories.forEach((category) => {
        const container = document.getElementById(category);
        container.innerHTML = ""; // Svuota il contenitore
        emails
            .filter((email) => email.category === category)
            .forEach((email) => {
                const emailBox = document.createElement("div");
                emailBox.classList.add("email");
                emailBox.innerHTML = `
                    <h3>${email.subject}</h3>
                    <p>${email.body}</p>
                `;
                container.appendChild(emailBox);
            });
    });
}

// Listener per filtrare email
document.addEventListener("DOMContentLoaded", () => {
    fetchEmails();

    const categoryButtons = document.querySelectorAll(".category-button");
    categoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            displayEmailsByCategory(button.id);
        });
    });
});
