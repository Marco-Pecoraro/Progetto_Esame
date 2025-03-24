document.addEventListener('DOMContentLoaded', () => {
    const syncBtn = document.getElementById('sync-btn');
    const emailList = document.getElementById('email-list');
    const folders = document.querySelectorAll('.folder');
    const folderTitle = document.getElementById('folder-title');
    const emailCount = document.getElementById('email-count');

    let currentCategory = 'inbox';

    // Carica le email iniziali
    loadEmails(currentCategory);

    // Sincronizza email
    syncBtn.addEventListener('click', async () => {
        syncBtn.disabled = true;
        syncBtn.innerHTML = '<span class="material-symbols-outlined">sync</span> Sincronizzazione...';

        try {
            const response = await fetch('http://localhost:5000/api/sync', {
                method: 'POST'
            });
            const data = await response.json();

            if (data.status === 'success') {
                loadEmails(currentCategory);
                alert(`Sincronizzate ${data.new_emails} nuove email`);
            }
        } catch (error) {
            console.error('Errore durante la sincronizzazione:', error);
            alert('Errore durante la sincronizzazione');
        } finally {
            syncBtn.disabled = false;
            syncBtn.innerHTML = '<span class="material-symbols-outlined">sync</span> Sincronizza';
        }
    });

    // Cambia categoria
    folders.forEach(folder => {
        folder.addEventListener('click', () => {
            folders.forEach(f => f.classList.remove('active'));
            folder.classList.add('active');
            currentCategory = folder.dataset.category;
            folderTitle.textContent = folder.querySelector('span:last-child').textContent;
            loadEmails(currentCategory);
        });
    });

    // Funzione per caricare le email
    async function loadEmails(category) {
        emailList.innerHTML = '<div class="loading">Caricamento...</div>';

        try {
            const response = await fetch(`http://localhost:5000/api/emails?category=${category}`);
            const data = await response.json();

            if (data.status === 'success') {
                renderEmails(data.data);
                emailCount.textContent = `${data.data.length} email`;
            }
        } catch (error) {
            console.error('Errore nel caricamento email:', error);
            emailList.innerHTML = '<div class="error">Errore nel caricamento</div>';
        }
    }

    // Renderizza le email
    function renderEmails(emails) {
        if (emails.length === 0) {
            emailList.innerHTML = '<div class="empty">Nessuna email</div>';
            return;
        }

        emailList.innerHTML = emails.map(email => `
            <div class="email-item ${email.read ? '' : 'unread'}">
                <div class="email-sender">${email.sender}</div>
                <div class="email-subject">${email.subject}</div>
                <div class="email-preview">${email.preview}...</div>
                <div class="email-date">${new Date(email.date).toLocaleString()}</div>
            </div>
        `).join('');
    }
});