<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../index/db_connect.php';


$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur JSON: ' . json_last_error_msg()
    ]);
    exit;
}

$required = ['id_utilisateur', 'id_medecin', 'couleur', 'date_debut', 'date_fin'];
foreach ($required as $key) {
    if (!isset($data[$key])) {
        echo json_encode([
            'success' => false,
            'message' => "Champ manquant: $key"
        ]);
        exit;
    }
}

$stmt = $conn->prepare("INSERT INTO rendez_vous (id_utilisateur, id_medecin, couleur, date_debut, date_fin) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("iisss", $data['id_utilisateur'], $data['id_medecin'], $data['couleur'], $data['date_debut'], $data['date_fin']);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Erreur lors de l\'insertion.']);
}
?>
