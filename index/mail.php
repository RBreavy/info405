<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];

    // Vérifie si l'email est valide
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $to = $email;
        $subject = "Réinitialisation de votre mot de passe";
        $message = "Pour récupérer votre mot de passe, cliquez sur ce lien : blabla";
        $headers = "From: info405mailrecup@gmail.com\r\n" .
                   "Reply-To: info405mailrecup@gmail.com\r\n" .
                   "Content-Type: text/plain; charset=UTF-8";

        // Envoi de l'email
        if (mail($to, $subject, $message, $headers)) {
            echo "<p>Email envoyé avec succès à $email</p>";
        } else {
            echo "<p>Erreur lors de l'envoi du mail. Veuillez réessayer.</p>";
        }
    } else {
        echo "<p>L'email est invalide.</p>";
    }
}
?>
