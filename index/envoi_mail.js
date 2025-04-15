function generateToken(length = 32) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return token;
}

function envoiMail() {
    const email = document.getElementById('mail-recup').value;
    const token = generateToken();
    const resetLink = `http://51.68.91.213/info2/site/index/reset_mdp.html?token=${token}`;

    const message = `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetLink}`;

    fetch('/info2/site/PHP/set_token.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, token: token })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            return fetch('/info2/site/PHP/send_mail.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to_email: email,
                    message: message,
                    subject: "Réinitialiser votre mot de passe"
                })
            });
        } else {
            throw new Error('Erreur lors de l\'enregistrement du token.');
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Un email de réinitialisation a été envoyé à ' + email);
        } else {
            alert('Erreur lors de l\'envoi de l\'email: ' + (data.message || 'Erreur inconnue'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message || 'Une erreur est survenue, veuillez réessayer plus tard.');
    });
}