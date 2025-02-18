<?php
error_reporting(0);
ini_set('display_errors', 0);

include_once "../index/db_connect.php";

try {
    $query = "SELECT r.*, m.nom AS nom_medecin, u.nom AS nom_utilisateur, 
              p.date_debut, p.date_fin 
              FROM rdv r
              JOIN medecin m ON r.id_medecin = m.id_medecin 
              JOIN utilisateurs u ON r.id_utilisateurs = u.id_utilisateurs
              JOIN periode p ON r.id_periode = p.id_periode";
              
    $stmt = $connexion->query($query);
    $rdvs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    header('Content-Type: application/json');
    echo json_encode($rdvs);
} catch(PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode(['error' => $e->getMessage()]);
}