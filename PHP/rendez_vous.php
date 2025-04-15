<?php
// Afficher les erreurs (temporairement pour le debug)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// En-tête JSON
header("Content-Type: application/json");

// Connexion à la base
include('../index/db_connect.php');

// Lire et décoder les données JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Données JSON invalides."]);
    exit;
}

// Vérifier que tous les champs sont présents
$required_fields = ['id_medecin', 'id_utilisateur', 'couleur', 'date_debut', 'date_fin'];
foreach ($required_fields as $field) {
    if (!isset($data[$field])) {
        echo json_encode(["success" => false, "message" => "Champ manquant : $field"]);
        exit;
    }
}

// Récupération des données
$id_medecin = $data['id_medecin'];
$id_utilisateur = $data['id_utilisateur'];
$couleur = $data['couleur'];
$date_debut_str = $data['date_debut'];
$date_fin_str = $data['date_fin'];

// Vérification du format des dates
try {
    $date_debut = new DateTime($date_debut_str);
    $date_fin = new DateTime($date_fin_str);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "Format de date invalide."]);
    exit;
}

// Calcul de la durée en minutes
$duree_minutes = ($date_fin->getTimestamp() - $date_debut->getTimestamp()) / 60;
if ($duree_minutes < 10 || $duree_minutes > 40) {
    echo json_encode(["success" => false, "message" => "La durée du rendez-vous doit être entre 10 et 40 minutes."]);
    exit;
}

// Requête d'insertion
$sql = "INSERT INTO rdv (id_medecin, id_utilisateurs, couleur, date_debut, date_fin) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

$executed = $stmt->execute([
    $id_medecin,
    $id_utilisateur,
    $couleur,
    $date_debut->format('Y-m-d H:i:s'),
    $date_fin->format('Y-m-d H:i:s')
]);

// if ($stmt) {
    

//     if ($executed) {
//         echo json_encode(["success" => true]);
//     } else {
//         echo json_encode(["success" => false, "message" => "Erreur lors de l'exécution de la requête."]);
//     }
// } else {
//     echo json_encode(["success" => false, "message" => "Erreur de préparation de la requête SQL."]);
// }
?>