<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];

    // L'email de l'expéditeur (votre adresse e-mail)
    $from = 'info405mailrecup@gmail.com';

    // Sujet de l'email
    $subject = 'Réinitialisation de votre mot de passe';

    // Contenu du message
    $message = 'Pour récupérer votre mot de passe, cliquez sur ce lien : <a href="votre-lien-de-récupération">Réinitialiser</a>';

    // Entêtes de l'email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8" . "\r\n";
    $headers .= 'From: ' . $from . "\r\n";
    $headers .= 'Reply-To: ' . $from . "\r\n";

    // Envoi de l'email
    if (mail($email, $subject, $message, $headers)) {
        echo json_encode(["success" => true, "message" => "E-mail envoyé avec succès !"]);
    } else {
        echo json_encode(["success" => false, "message" => "Erreur lors de l'envoi du mail."]);
    }
}
?>