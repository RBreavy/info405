<?php

session_start();
require_once "info2/site/PHP/db_connect.php";

$data = json_decode(file_get_contents('php://input'), true);

// Récupérer les données
$type = $data['type'];
$id_medecin = $data['id_medecin'];
$jour_debut = $data['jour_debut'];
$jour_fin = $data['jour_fin'];
$heure_debut = $data['heure_debut'];
$heure_fin = $data['heure_fin'];

// Combiner la date et l'heure pour "date_debut" et "date_fin"
$date_debut = date('Y-m-d H:i:s', strtotime($jour_debut . ' ' . $heure_debut));
$date_fin = date('Y-m-d H:i:s', strtotime($jour_fin . ' ' . $heure_fin));

// Préparer et exécuter la requête d'insertion dans la base de données
$stmt = $conn->prepare("INSERT INTO rdv (id_medecin, date_debut, date_fin) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $id_medecin, $date_debut, $date_fin);
$stmt->execute();

echo json_encode(['status' => 'success']);
?>