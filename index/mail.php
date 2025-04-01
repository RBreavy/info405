<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];

    // Journal des événements côté serveur
    error_log("📨 Demande d'envoi d'email à : $email");

    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $to = $email;
        $subject = "Réinitialisation de votre mot de passe";
        $message = "Pour récupérer votre mot de passe, cliquez sur ce lien : blabla";
        $headers = "From: info405mailrecup@gmail.com\r\n" .
            "Reply-To: info405mailrecup@gmail.com\r\n" .
            "Content-Type: text/plain; charset=UTF-8";

        if (mail($to, $subject, $message, $headers)) {
            error_log("✅ Email envoyé avec succès à : $email");
            echo json_encode(["success" => true, "message" => "E-mail envoyé avec succès !"]);
        } else {
            error_log("❌ Erreur lors de l'envoi de l'email à : $email");
            echo json_encode(["success" => false, "message" => "Erreur lors de l'envoi du mail."]);
        }
    } else {
        error_log("⚠️ Email invalide fourni : $email");
        echo json_encode(["success" => false, "message" => "L'email est invalide."]);
    }
}
?>