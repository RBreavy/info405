<?php
// Connexion à la BDD
require_once(__DIR__ . './index/db_connect/db_connect.php');

// Récupération des données JSON envoyées
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'];
$token = $data['token'];

// Date d’expiration (1 heure plus tard)
$expires = date('Y-m-d H:i:s', strtotime('+1 hour'));

// Mise à jour dans la BDD
$stmt = $conn->prepare("UPDATE utilisateurs SET reset_token = ?, reset_token_expires = ? WHERE email = ?");
$success = $stmt->execute([$token, $expires, $email]);

echo json_encode(['success' => $success]);