// Funzione per sincronizzare le email
async function syncEmails() {
    try {
        const response = await fetch('/sync_emails');
        const data = await response.json();

        const emailList = document.getElementById('mail_currentSelection');
        emailList.innerHTML = ''; // Pulisci la lista

        data.forEach(email => {
            const emailDiv = document.createElement('div');
            emailDiv.className = 'box_divider';
            emailDiv.innerHTML = `
                <div class="box_content">
                    <h1>${email.subject}</h1>
                    <p>${email.body}</p>
                </div>
            `;
            emailList.appendChild(emailDiv);
        });
    } catch (error) {
        console.error('Errore durante la sincronizzazione delle email:', error);
    }
}

// Funzione per inviare email
async function sendEmail(to, subject, body) {
    try {
        const response = await fetch('/send_email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ to, subject, body })
        });

        const data = await response.json();
        if (data.status === 'success') {
            alert('Email inviata con successo!');
        } else {
            alert('Errore durante l\'invio dell\'email: ' + data.error);
        }
    } catch (error) {
        console.error('Errore durante l\'invio dell\'email:', error);
    }
}

// Aggiungi event listener per il pulsante di sincronizzazione
document.addEventListener('DOMContentLoaded', () => {
    const syncButton = document.querySelector('#arriving');
    if (syncButton) {
        syncButton.addEventListener('click', syncEmails);
    }

    // Aggiungi event listener per il form di invio email
    const emailForm = document.querySelector('#emailForm');
    if (emailForm) {
        emailForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const to = document.getElementById('to').value;
            const subject = document.getElementById('subject').value;
            const body = document.getElementById('body').value;
            sendEmail(to, subject, body);
        });
    }
});