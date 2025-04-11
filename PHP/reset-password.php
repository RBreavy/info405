<?php

header("Content-Type: application/json");
require_once('./index/db_connect/db_connect.php'); // ta connexion PDO à la base de données

// Lire les données JSON du corps de la requête
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['token']) || !isset($data['newPassword'])) {
    echo json_encode(["success" => false, "message" => "Champs manquants"]);
    exit;
}

$token = $data['token'];

// Tu dois avoir une table genre "reset_tokens" associée à chaque utilisateur
// On cherche l'utilisateur associé à ce token
$sql = "SELECT email FROM reset_tokens WHERE token = ?";
$stmt = $conn->prepare($sql);
$stmt->execute([$token]);
$user = $stmt->fetch();

if (!$user) {
    echo json_encode(["success" => false, "message" => "Token invalide"]);
    exit;
}

$email = $data['email'];

// Mise à jour du mot de passe de l'utilisateur
$update = $conn->prepare("UPDATE utilisateurs SET password = ? WHERE email = ?");
$success = $update->execute([$data['newPassword'], $email]);

if ($success) {
    // Supprimer le token après usage
    $del = $conn->prepare("DELETE FROM reset_tokens WHERE token = ?");
    $del->execute([$token]);

    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour"]);
}
?>