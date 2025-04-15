<?php
header("Content-Type: application/json");
include('../index/db_connect.php');

// Récupération des données JSON
$data = json_decode(file_get_contents("php://input"), true);

// Vérifier les champs nécessaires
if (!isset($data['id_medecin'], $data['id_utilisateur'], $data['couleur'], $data['date_debut'], $data['date_fin'])) {
    echo json_encode(["success" => false, "message" => "Champs manquants"]);
    exit;
}

$id_medecin = $data['id_medecin'];
$id_utilisateur = $data['id_utilisateur'];
$couleur = $data['couleur'];

try {
    $date_debut = new DateTime($data['date_debut']);
    $date_fin = new DateTime($data['date_fin']);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Format de date invalide"]);
    exit;
}

// Calcul de la durée en minutes
$duree_minutes = ($date_fin->getTimestamp() - $date_debut->getTimestamp()) / 60;

if ($duree_minutes < 10 || $duree_minutes > 40) {
    echo json_encode(["success" => false, "message" => "La durée du rendez-vous doit être entre 10 et 40 minutes."]);
    exit;
}

$sql = "INSERT INTO rdv (id_medecin, id_utilisateurs, couleur, date_debut, date_fin) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

if ($stmt) {
    if (
        $stmt->execute([
            $id_medecin,
            $id_utilisateur,
            $couleur,
            $date_debut->format('Y-m-d H:i:s'),
            $date_fin->format('Y-m-d H:i:s')
        ])
    ) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Erreur lors de la prise de rendez-vous."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Erreur lors de la préparation de la requête."]);
}
?>