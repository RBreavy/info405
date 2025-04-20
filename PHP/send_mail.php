<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


header('Content-Type: application/json');

require_once __DIR__ . '/../lib/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/../lib/PHPMailer/src/SMTP.php';
require_once __DIR__ . '/../lib/PHPMailer/src/Exception.php';


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once '/info2/site/index/db_connect.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['to_email']) || !isset($data['message']) || !isset($data['subject'])) {
    http_response_code(400);
    die(json_encode(['success' => false, 'message' => 'Champs obligatoires manquants']));
}

// Validation de l'email
if (!filter_var($data['to_email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    die(json_encode(['success' => false, 'message' => 'Email invalide']));
}

$mail = new PHPMailer(true);

try {
    // Configuration SMTP
    $mail->isSMTP();
    $mail->Host = 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = 'info405mailrecup@gmail.com';
    $mail->Password = 'xvzq fxdo dfpg cjpo';
    $mail->SMTPSecure = 'tls';
    $mail->Port = 587;
    $mail->CharSet = 'UTF-8';
    $mail->ErrorInfo;

    // Expéditeur
    $mail->setFrom('info405mailrecup@gmail.com', 'Libdocto');

    // Destinataire
    $mail->addAddress($data['to_email']);

    // Contenu
    $mail->Subject = $data['subject'];
    $mail->Body = $data['message'];

    // Envoi
    $mail->send();
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de l\'envoi du mail',
        'error' => $mail->ErrorInfo // Note: Ne pas exposer cela en production!
    ]);
}