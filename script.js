function generateEmailVariations(username) {
    const domain = 'gmail.com';
    const variations = new Set();
    
    function addDots(usr, pos) {
        if (variations.size >= 999) return;
        
        if (pos >= usr.length - 1) {
            variations.add(usr + '@' + domain);
            return;
        }

        addDots(usr.slice(0, pos + 1) + '.' + usr.slice(pos + 1), pos + 2);
        addDots(usr, pos + 1);
    }

    addDots(username, 0);
    
    return Array.from(variations).slice(0, 500);
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    // Show the alert
    const alert = document.getElementById('copyAlert');
    alert.style.display = 'block';
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => {
            alert.style.display = 'none';
            alert.style.opacity = '1';
        }, 500);
    }, 2000); // Alert duration
}

document.getElementById('generateButton').addEventListener('click', function() {
    const username = document.getElementById('usernameInput').value;
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

            const copyButton = document.createElement('button');
            copyButton.className = 'btn btn-sm btn-outline-secondary';
            copyButton.textContent = 'Copiar';
            copyButton.addEventListener('click', () => copyToClipboard(variation));

            emailItem.appendChild(emailText);
            emailItem.appendChild(copyButton);
            resultsDiv.appendChild(emailItem);

            length.innerHTML = `Itens gerados: <b>${emailVariations.length}</b>`;

        });
    } else {
        length.innerHTML = `Itens gerados: 0`;
    }
});
