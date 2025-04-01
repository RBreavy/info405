<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"];

    // Vérifier si l'email est valide
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "⚠️ Email invalide."]);
        exit;
    }

    // Configuration de l'email
    $to = $email;
    $subject = "Réinitialisation de votre mot de passe";
    $message = "Pour récupérer votre mot de passe, cliquez sur ce lien : blabla";
    $headers = "From: info405mailrecup@gmail.com\r\n" .
        "Reply-To: info405mailrecup@gmail.com\r\n" .
        "Content-Type: text/plain; charset=UTF-8\r\n" .
        "MIME-Version: 1.0\r\n";

    error_log("📨 Tentative d'envoi d'email à : $email");

    // Envoyer l'email
    if (mail($to, $subject, $message, $headers)) {
        error_log("✅ E-mail envoyé avec succès à $email");
        echo json_encode(["success" => true, "message" => "📩 E-mail envoyé avec succès !"]);
    } else {
        error_log("❌ Erreur lors de l'envoi du mail à $email");
        echo json_encode(["success" => false, "message" => "❌ Erreur lors de l'envoi du mail."]);
    }
}
?>