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

$start_minutes = (int)$start->format('i');
if ($start_minutes % 10 !== 0) {
    echo json_encode([
        'success' => false,
        'message' => 'L\'heure de début doit se terminer par 0 (ex: 8h00, 8h10, 8h20)'
    ]);
    exit;
}


$interval = $start->diff($end);
$actual_minutes = ($interval->h * 60) + $interval->i;


if (!in_array($duration_minutes, [10, 20, 30])) {
    echo json_encode([
        'success' => false,
        'message' => 'La durée du rendez-vous doit être de 10, 20 ou 30 minutes exactement'
    ]);
    exit;
}


if ($end <= $start) {
    echo json_encode([
        'success' => false,
        'message' => 'La date de fin doit être après la date de début'
    ]);
    exit;
}

// Vérifier que le rendez-vous est dans le futur
$now = new DateTime();
if ($start <= $now) {
    echo json_encode([
        'success' => false,
        'message' => 'Le rendez-vous doit être dans le futur'
    ]);
    exit;
}

// Vérifier que le rendez-vous n'est pas plus de 6 mois à l'avance
$six_months = new DateTime();
$six_months->modify('+6 months');
if ($start > $six_months) {
    echo json_encode([
        'success' => false,
        'message' => 'Le rendez-vous ne peut pas être pris plus de 6 mois à l\'avance'
    ]);
    exit;
}

// ▲▲▲  ▲▲▲



// Vérifie s’il y a un conflit avec un autre rendez-vous du même médecin
$check = $conn->prepare("
    SELECT COUNT(*) as count FROM rdv 
    WHERE (id_medecin = ? OR id_utilisateurs = ?)
    AND (
        (date_debut < ? AND date_fin > ?) OR
        (date_debut >= ? AND date_debut < ?)
    )
");

$check->bind_param(
    "iissss",
    $data['id_medecin'],
    $data['id_utilisateur'],
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
        'message' => 'Ce créneau est déjà réservé.'
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