// Importation de Nodemailer
const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');

// Création du serveur Express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'info405mailrecup@gmail.com',
        pass: 'Motdepasse73'
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