function generateEmailVariations(username) {
    const domain = 'gmail.com';
    const variations = new Set();
    const maxItens = 999;

    // Remove qualquer coisa após o '@'
    if (username.includes('@')) {
        username = username.split('@')[0];
    }

    // Armazenar posições dos pontos existentes
    const dotPositions = new Set();
    for (let i = 0; i < username.length; i++) {
        if (username[i] === '.') {
            dotPositions.add(i);
        }
    }

    // Função para gerar variações com pontos
    function addDots(usr, index) {
        if (variations.size >= maxItens) return;

        // Adiciona a variação atual
        variations.add(usr + '@' + domain);

        // Adiciona pontos nas posições subsequentes, ignorando onde já há um ponto
        for (let i = index; i < usr.length; i++) {
            if (!dotPositions.has(i) && !dotPositions.has(i + 1) && usr[i] !== '.' && i !== usr.length-1) {
                const newUsername = usr.slice(0, i + 1) + '.' + usr.slice(i + 1);
                if (!newUsername.includes('..')) { // Verifica se não há dois pontos seguidos
                    addDots(newUsername, i + 2);
                }
            }
        }
    }

    if (username) {
        addDots(username, 0); // Não remove pontos existentes
    }

    return Array.from(variations).slice(0, maxItens);
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    // Mostrar o alerta
    const alert = document.getElementById('copyAlert');
    alert.style.display = 'block';
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => {
            alert.style.display = 'none';
            alert.style.opacity = '1';
        }, 500);
    }, 2000); // Duração do alerta
}

document.getElementById('generateButton').addEventListener('click', function() {
    const downloadButtonSpan = document.querySelector('#downloadButton .value');
    const itemText = document.querySelector('.itemText');
    const username = document.getElementById('usernameInput').value.toLowerCase();
    const emailVariations = generateEmailVariations(username);
    document.getElementById('usernameInput').value = username;
    downloadButtonSpan.textContent = `Baixar (${emailVariations.length})`;
    const resultsDiv = document.querySelector('.results');
    resultsDiv.innerHTML = '';

    if (username) {
        emailVariations.forEach(variation => {
            const emailItem = document.createElement('div');
            emailItem.className = 'email-item';

            const emailText = document.createElement('span');
            emailText.textContent = variation;
            emailText.className = 'email-text'; // Adiciona uma classe para o texto do email
            emailText.addEventListener('click', () => copyToClipboard(variation));

            emailItem.appendChild(emailText);
            resultsDiv.appendChild(emailItem);

            resultsDiv.style.display = 'flex';
            itemText.style.display = 'block';
        });
    } else {
            resultsDiv.style.display = 'none';
            itemText.style.display = 'none';

    }
});

document.getElementById('downloadButton').addEventListener('click', function() {
    const resultsDiv = document.querySelector('.results');
    const emailItems = resultsDiv.querySelectorAll('.email-item .email-text');
    let textContent = 'Gerador de Gmail - Método AliExpress' + '\n' + 'Telegram: https://t.me/+UxtEOGHmY1UzYTVh' + '\n\n';

    emailItems.forEach(item => {
        textContent += item.textContent + '\n';
    });

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emails_metodo_aliexpress.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});
