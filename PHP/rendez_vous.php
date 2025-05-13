<?php

// ▼▼▼  ▼▼▼
$duration_colors = [
    '10' => 'lightgreen',
    '20' => 'lightorange', 
    '30' => 'lightred'
];
// ▲▲▲  ▲▲▲


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

// ▼▼▼  ▼▼▼
$duration_colors = [
    '10' => 'lightgreen',
    '20' => 'lightorange', 
    '30' => 'lightred'
];

$data['duration'] = $data['duration'] ?? 30; 

$start = new DateTime($data['date_debut']);
$end = new DateTime($data['date_fin']);
$interval = $start->diff($end);
$actual_minutes = ($interval->h * 60) + $interval->i;

if ($actual_minutes <= 10) {
    $duration_key = '10';
} elseif ($actual_minutes <= 20) {
    $duration_key = '20';
} else {
    $duration_key = '30';
}

if (!isset($data['couleur']) || empty($data['couleur'])) {
    $data['couleur'] = $duration_colors[$duration_key] ?? 'blue';
}
// ▲▲▲  ▲▲▲



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


//check 2
$check2 = $conn->prepare("
    SELECT COUNT(*) as count FROM IndisponibiliteTemporaire
    WHERE id_medecin = ? 
    AND (
        (debut_periode < ? AND fin_periode > ?) OR
        (debut_periode >= ? AND debut_periode < ?)
    )
");
$check2->bind_param(
    "issss",
    $data['id_medecin'],
    $data['date_fin'],
    $data['date_debut'],
    $data['date_debut'],
    $data['date_fin']
);
$check2->execute();
$check_result2 = $check2->get_result()->fetch_assoc();



//check 3
$check3 = $conn->prepare("
    SELECT COUNT(*) as count FROM IndisponibiliteRepetitive
    WHERE id_medecin = ?
    AND journee = ?
    AND (
        (heure_debut < ? AND heure_fin > ?) OR
        (heure_debut >= ? AND heure_debut < ?)
    )
");


$jour_deb = $start->format('D');
$jour_map = [
    'Mon' => 'LUN',
    'Tue' => 'MAR',
    'Wed' => 'MER',
    'Thu' => 'JEU',
    'Fri' => 'VEN',
    'Sat' => 'SAM',
    'Sun' => 'DIM'
];
$journee = $jour_map[$jour_deb];


$h_deb = $start->format('H:i');
$h_fin = $end->format('H:i');

$check3->bind_param(
    "isssss",
    $data['id_medecin'],
    $journee,
    $h_fin,
    $h_deb,
    $h_deb,
    $h_fin
);

$check3->execute();
$check_result3 = $check3->get_result()->fetch_assoc();

if ($check_result2['count'] > 0 || $check_result3['count'] > 0) {
    echo json_encode([
        'success' => false,
        'message' => 'Ce créneau est indisponible!.'
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