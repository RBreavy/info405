<?php
require_once '../lib/PHPMailer/src/PHPMailer.php';
require_once '../index/db_connect.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['to_email']) || !isset($data['message']) || !isset($data['subject'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$mail = new PHPMailer;

$mail->isSMTP();
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->Username = 'info405mailrecup@gmail.com';
$mail->Password = 'mailrecup';
$mail->SMTPSecure = 'tls';
$mail->Port = 587;

$mail->setFrom('info405mailrecup@gmail.com', 'Libdocto');
$mail->addAddress($data['to_email']);
$mail->Subject = $data['subject'];
$mail->Body = $data['message'];

if (!$mail->send()) {
    echo json_encode(['success' => false, 'message' => 'Mailer Error: ' . $mail->ErrorInfo]);
} else {
    echo json_encode(['success' => true]);
}
?>