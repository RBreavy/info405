<?php
header("Content-Type: application/json");
require_once('db_connect.php');

// Lire les données JSON du corps de la requête
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['token']) || !isset($data['newPassword'])) {
    echo json_encode(["success" => false, "message" => "Champs manquants"]);
    exit;
}


$token = $data['token'];
$newPassword = password_hash($data['newPassword'], PASSWORD_DEFAULT); // Hash du mot de passe

// On cherche l'utilisateur par son token et sa date de validité
$sql = "SELECT email FROM utilisateurs WHERE reset_token = ? AND reset_token_expires > NOW()";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Erreur de préparation", "error" => $conn->error]);
    exit;
}
$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo json_encode(["success" => false, "message" => "Token invalide ou expiré"]);
    exit;
}

$email = $user['email'];

// Mise à jour du mot de passe + suppression du token
$update = $conn->prepare("UPDATE utilisateurs SET mot_de_passe = ?, reset_token = NULL, reset_token_expires = NULL WHERE email = ?");
$update->bind_param("ss", $newPassword, $email);
$success = $update->execute();

if ($success) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Erreur lors de la mise à jour"]);
}
?>