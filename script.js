function setLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getLocalStorage(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
}

function deleteLocalStorage(key) {
    localStorage.removeItem(key);
}

function generateEmailVariations(username) {
    const domain = 'gmail.com';
    const variations = new Set();
    const maxItens = 512;

    if (username.includes('@')) {
        username = username.split('@')[0];
    }

    const dotPositions = new Set();
    for (let i = 0; i < username.length; i++) {
        if (username[i] === '.') {
            dotPositions.add(i);
        }
    }

    function addDots(usr, index) {
        if (variations.size >= maxItens) return;
        variations.add(usr + '@' + domain);

        for (let i = index; i < usr.length; i++) {
            if (!dotPositions.has(i) && !dotPositions.has(i + 1) && usr[i] !== '.' && i !== usr.length - 1) {
                const newUsername = usr.slice(0, i + 1) + '.' + usr.slice(i + 1);
                if (!newUsername.includes('..')) {
                    addDots(newUsername, i + 2);
                }
            }
        }
    }

    if (username) {
        addDots(username, 0);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const variationArray = Array.from(variations).slice(0, maxItens);
    return shuffle(variationArray);
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    const alert = document.getElementById('copyAlert');
    alert.style.display = 'block';
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => {
            alert.style.display = 'none';
            alert.style.opacity = '1';
        }, 500);
    }, 2000);
}

function loadResultsFromLocalStorage() {
    const savedResults = getLocalStorage('emailVariations');
    const savedUsername = getLocalStorage('username');
    if (savedResults && savedUsername) {
        const emailVariations = savedResults;
        document.getElementById('usernameInput').value = savedUsername;
        displayResults(emailVariations, savedUsername);
        document.getElementById('downloadButton').disabled = false;
        document.getElementById('deleteButton').disabled = false;
        document.getElementById('downloadButton').innerHTML = `<span class="material-symbols-outlined">download</span><span class="value">Baixar (${emailVariations.length})</span>`;
    }
}

function displayResults(emailVariations, username) {
    const results = document.querySelector('.results');
    const resultsDiv = document.querySelector('.results-inner');
    const itemText = document.querySelector('.itemText');
    resultsDiv.innerHTML = '';

    const originalEmail = username + '@gmail.com';
    const orderedVariations = [originalEmail, ...emailVariations.filter(email => email !== originalEmail)];

    orderedVariations.forEach(variation => {
        const emailItem = document.createElement('div');
        emailItem.className = 'email-item';

        const emailText = document.createElement('code');
        emailText.textContent = variation;
        emailText.className = 'email-text';
        emailText.addEventListener('click', () => copyToClipboard(variation));

        emailItem.appendChild(emailText);
        resultsDiv.appendChild(emailItem);

        results.style.display = 'flex';
        itemText.style.display = 'block';
    });
}

document.getElementById('generateButton').addEventListener('click', async function () {
    const downloadButton = document.getElementById('downloadButton');
    const downloadButtonSpan = document.querySelector('#downloadButton .value');
    const deleteButton = document.getElementById('deleteButton');
    const itemText = document.querySelector('.itemText');
    const usernameText = document.getElementById('usernameInput').value.replace(/\s+/g, '');
    const username = usernameText.toLowerCase();
    const emailVariations = await generateEmailVariations(username);
    document.getElementById('usernameInput').value = username;
    downloadButtonSpan.textContent = `Baixar (${emailVariations.length})`;
    const resultsDiv = document.querySelector('.results-inner');

    if (username) {
        if (document.getElementById('flexSwitchCheckChecked').checked) {
            setLocalStorage('emailVariations', emailVariations);
            setLocalStorage('username', username);
        }
        displayResults(emailVariations, username);
        downloadButton.disabled = false;
        deleteButton.disabled = false;
    } else {
        resultsDiv.innerHTML = '';
        document.querySelector('.results').style.display = 'none';
        itemText.style.display = 'none';
        downloadButton.disabled = true;
        deleteButton.disabled = true;
    }
});

document.getElementById('downloadButton').addEventListener('click', function () {
    const resultsDiv = document.querySelector('.results-inner');
    const emailItems = resultsDiv.querySelectorAll('.email-item .email-text');
    let textContent = 'Método AliExpress – Gerador de Variações do Gmail' + '\n' + 'Grupo no Telegram: https://t.me/+UxtEOGHmY1UzYTVh' + '\n\n';

    emailItems.forEach(item => {
        textContent += item.textContent + '\n';
    });

    const blob = new Blob([textContent], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emails_metodo_aliexpress.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

document.getElementById('deleteButton').addEventListener('click', function () {
    document.getElementById('usernameInput').value = '';
    document.querySelector('.results-inner').innerHTML = '';
    document.querySelector('.results').style.display = 'none';
    document.getElementById('itemText').style.display = 'none';
    document.getElementById('downloadButton').disabled = true;
    document.getElementById('deleteButton').disabled = true;
    document.getElementById('downloadButton').innerHTML = `<span class="material-symbols-outlined">download</span><span class="value">Baixar (0)</span>`;
    deleteLocalStorage('emailVariations');
    deleteLocalStorage('username');
});

window.onload = loadResultsFromLocalStorage;
