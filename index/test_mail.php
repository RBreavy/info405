<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$to = "ton-email@gmail.com"; // Remplace par ton email pour tester
$subject = "Test mail";
$message = "Ceci est un test";
$headers = "From: info405mailrecup@gmail.com\r\n" .
    "Reply-To: info405mailrecup@gmail.com\r\n" .
    "Content-Type: text/plain; charset=UTF-8";

if (mail($to, $subject, $message, $headers)) {
    echo "✅ Email envoyé avec succès !";
} else {
    echo "❌ Erreur lors de l'envoi de l'email.";
}
?>