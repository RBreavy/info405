<?php
error_reporting(0);
ini_set('display_errors', 0);

include_once "../index/db_connect.php";
function indisp_repet($id_medecin, $journee, $heure_debut, $heure_fin)
{
    global $conn;
    try {
        $query = "INSERT INTO IndisponibiliteRepetitive (id_medecin, journee, heure_debut, heure_fin)  
                  VALUES ($id_medecin, '$journee', '$heure_debut', '$heure_fin')";
        $result = mysqli_query($conn, $query);
        return ['success' => $result];
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

function indisp_temp($id_medecin, $debut_periode, $fin_periode)
{
    global $conn;
    try {
        $query = "INSERT INTO IndisponibiliteTemporaire (id_medecin, debut_periode, fin_periode)  
                  VALUES ($id_medecin, '$debut_periode', '$fin_periode')";
        $result = mysqli_query($conn, $query);
        return ['success' => $result];
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

$action = $_GET['action'] ?? 'temp';
header('Content-Type: application/json');

switch ($action) {
    case 'temp':
        $id_medecin = $_GET['med'] ?? null;
        $debut_periode = $_GET['deb_p'] ?? null;
        $fin_periode = $_GET['fin_p'] ?? null;
        echo json_encode(indisp_temp($id_medecin, $debut_periode, $fin_periode));
        break;
    case 'repet':
        $id_medecin = $_GET['med'] ?? null;
        $journee = $_GET['jour'] ?? null;
        $heure_debut = $_GET['deb'] ?? null;
        $heure_fin = $_GET['fin'] ?? null;
        echo json_encode(indisp_repet($id_medecin, $journee, $heure_debut, $heure_fin));
        break;
}
?>