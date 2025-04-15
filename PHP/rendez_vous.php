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

// Vérifie s’il y a un conflit avec un autre rendez-vous du même médecin
$check = $conn->prepare("
    SELECT COUNT(*) as count FROM rdv 
    WHERE id_medecin = ? 
    AND (
        (date_debut < ? AND date_fin > ?) OR
        (date_debut >= ? AND date_debut < ?)
    )
");
$check->bind_param(
    "issss",
    $data['id_medecin'],
    $data['date_fin'],
    $data['date_debut'],
    $data['date_debut'],
    $data['date_fin']
);
$check->execute();
$check_result = $check->get_result()->fetch_assoc();

if ($check_result['count'] > 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Ce créneau est déjà réservé pour ce médecin.'
    ]);
    exit;
}

// Insertion du nouveau rendez-vous
$stmt = $conn->prepare("
    INSERT INTO rdv (id_utilisateurs, id_medecin, couleur, date_debut, date_fin)
    VALUES (?, ?, ?, ?, ?)
");
$stmt->bind_param(
    "iisss",
    $data['id_utilisateur'],
    $data['id_medecin'],
    $data['couleur'],
    $data['date_debut'],
    $data['date_fin']
);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur lors de l\'insertion.'
    ]);
}
?>