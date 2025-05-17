<?php
header('Content-Type: application/json');
include_once "db_connect.php";
session_start();

// Récupérer l'ID du rendez-vous
$data = json_decode(file_get_contents('php://input'), true);
$id_rdv = $data['id_rdv'] ?? 0;
$user_id = $_SESSION['user_id'] ?? 0;
$user_type = $_SESSION['user_type'] ?? '';

// Créer la requête selon le type d'utilisateur (médecin ou patient)
$query = ($user_type === 'medecin')
    ? "DELETE FROM rdv WHERE id_rdv = ? AND id_medecin = ?"
    : "DELETE FROM rdv WHERE id_rdv = ? AND id_utilisateurs = ?";

// Exécuter la requête
$stmt = $conn->prepare($query);
$stmt->bind_param("ii", $id_rdv, $user_id);
$stmt->execute();

// Renvoyer le résultat
echo json_encode(['success' => $stmt->affected_rows > 0]);

$stmt->close();
$conn->close();
?>