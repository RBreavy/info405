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
    // Récupérer l'email saisi par l'utilisateur
    const email = document.getElementById('mail-recup').value;

    const token = generateToken();
    const resetLink = `http://51.68.91.213/info2/site/index/reset_mdp.html?token=${token}`;

    const message = `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetLink}`;

    // Paramètres de l'email à envoyer
    const templateParams = {
        to_email: email,
        message: message,
        subject: "réinitialiser votre mot de passe"
    };

    // Service et template ID
    const serviceID = 'service_info405';
    const templateID = 'template_1wicn1k';

    // Envoi de l'email
    emailjs.send(serviceID, templateID, templateParams)
        .then(function(response) {
            console.log('Email envoyé avec succès !', response.status, response.text);
            alert('Un email de réinitialisation a été envoyé à ' + email);
        }, function(error) {
            console.log('Erreur lors de l\'envoi de l\'email :', error);
            alert('Une erreur est survenue, veuillez réessayer plus tard.');
        });
}
