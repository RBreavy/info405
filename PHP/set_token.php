<?php
// Connexion à la BDD
require_once('../index/db_connect.php');

// Récupération des données JSON envoyées
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'];
$token = $data['token'];

// Date d’expiration (1 heure plus tard)
$expires = date('Y-m-d H:i:s', strtotime('+1 hour'));

// Préparation de la requête
$stmt = $conn->prepare("UPDATE utilisateurs SET reset_token = ?, reset_token_expires = ? WHERE email = ?");

if ($stmt) {
    // On lie les paramètres au bon format : s = string
    $stmt->bind_param("sss", $token, $expires, $email);
    $success = $stmt->execute();
    echo json_encode(['success' => $success]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}
?>