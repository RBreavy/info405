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

/*Fonction pour récupérer les rdv en fonctions d'un médecin
function getRdvpourdocteur($doctors) {
    global $conn;
    try {
        $query = "SELECT medecin.nom, utilisateurs.nom, periode.date_debut, periode.date_fin, couleur
                    FROM rdv
                    JOIN medecin ON rdv.id_medecin = medecin.id_medecin
                    JOIN utilisateurs ON rdv.id_utilisateurs = utilisateurs.id_utilisateurs
                    JOIN periode ON rdv.id_periode = periode.id_periode
                    WHERE medecin.nom = $doctors;"
                  
        $result = mysqli_query($conn, $query);
        $rdvs = mysqli_fetch_all($result, MYSQLI_ASSOC);
        
        return $rdvs;
    } catch(Exception $e) {
        return ['error' => $e->getMessage()];
    }




}*/

//Fonction pour créé les rdv en fonctions d'un médecin
function creer_rdv($id_medecin,$id_periode,$id_utilisateur,$couleur) {
    global $conn;
    try {
        $query = "INSERT INTO rdv (id_medecin, id_utilisateurs, id_periode, couleur)  
                  VALUES ($id_medecin,$id_utilisateurs,$id_periode,$couleur);"
                  
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