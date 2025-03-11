<?php
error_reporting(0);
ini_set('display_errors', 0);

include_once "../index/db_connect.php";

// Fonction pour récupérer tous les rendez-vous
function getAllRdvs() {
    global $conn;
    
    try {
        $query = "SELECT m.nom AS nom_medecin, u.nom AS nom_utilisateur, 
                  p.date_debut, p.date_fin 
                  FROM rdv r
                  JOIN medecin m ON r.id_medecin = m.id_medecin 
                  JOIN utilisateurs u ON r.id_utilisateurs = u.id_utilisateurs
                  JOIN periode p ON r.id_periode = p.id_periode";
                  
        $result = mysqli_query($conn, $query);
        $rdvs = mysqli_fetch_all($result, MYSQLI_ASSOC);
        
        return $rdvs;
    } catch(Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

// Nouvelle fonction pour récupérer tous les médecins
function getAllDoctors() {
    global $conn;
    
    try {
        $query = "SELECT id_medecin, nom FROM medecin";
        $result = mysqli_query($conn, $query);
        $doctors = mysqli_fetch_all($result, MYSQLI_ASSOC);
        
        return $doctors;
    } catch(Exception $e) {
        return ['error' => $e->getMessage()];
    }
}


// Traitement de la requête
$action = isset($_GET['action']) ? $_GET['action'] : 'rdvs';

header('Content-Type: application/json');

switch($action) {
    case 'doctors':
        echo json_encode(getAllDoctors());
        break;
    case 'rdvs':
    default:
        echo json_encode(getAllRdvs());
        break;
}
?>