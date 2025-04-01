// Importation de Nodemailer
const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');

// Création du serveur Express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration du transporteur Nodemailer (exemple avec Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',  // Tu peux aussi utiliser d'autres services comme SendGrid, Mailgun, etc.
    auth: {
        user: 'info405mailrecup@gmail.com', // Ton email
        pass: 'tonmotdepasse'               // Ton mot de passe ou mot de passe d'application
    }
});

// Point d'API pour envoyer un email
app.post('/send-mail', (req, res) => {
    const { email } = req.body;

    // Configuration de l'email
    const mailOptions = {
        from: 'info405mailrecup@gmail.com',
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        text: 'Pour récupérer votre mot de passe, cliquez sur ce lien : blabla'
    };

    // Envoi de l'email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.json({ success: false, message: '❌ Erreur lors de l\'envoi du mail.' });
        } else {
            return res.json({ success: true, message: '📩 E-mail envoyé avec succès !' });
        }
    });
});

// Démarrer le serveur sur le port 3000
app.listen(3000, () => {
    console.log('Serveur Node.js en cours d\'exécution sur le port 3000');
});
