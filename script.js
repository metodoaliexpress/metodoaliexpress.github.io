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
    const username = document.getElementById('usernameInput').value.trim();
    const length = document.getElementById('itensLength');
    const resultsDiv = document.querySelector('.results');
    resultsDiv.innerHTML = '';

    if (username) {
        const emailVariations = generateEmailVariations(username);
        emailVariations.forEach(variation => {
            const emailItem = document.createElement('div');
            emailItem.className = 'email-item';

            const emailText = document.createElement('span');
            emailText.textContent = variation;
            emailText.className = 'email-text'; // Adiciona uma classe para o texto do email
            emailText.addEventListener('click', () => copyToClipboard(variation));

            emailItem.appendChild(emailText);
            resultsDiv.appendChild(emailItem);

            length.innerHTML = `Clique nos itens para copiar. Foram geradas: <b>${emailVariations.length}</b> variações.`;
        });
    } else {
        length.innerHTML = `Itens gerados: 0`;
    }
});
