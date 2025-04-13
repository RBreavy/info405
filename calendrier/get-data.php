<?php
error_reporting(0);
ini_set('display_errors', 0);

include_once "../index/db_connect.php";

function getAllRdvs()
{
    global $conn;
    try {
        $query = "SELECT m.nom AS nom_medecin, u.nom AS nom_utilisateur, 
                  r.date_debut, r.date_fin 
                  FROM rdv r
                  JOIN medecin m ON r.id_medecin = m.id_medecin 
                  JOIN utilisateurs u ON r.id_utilisateurs = u.id_utilisateurs";
        $result = mysqli_query($conn, $query);
        return mysqli_fetch_all($result, MYSQLI_ASSOC);
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

function creer_rdv($id_medecin, $date_debut, $date_fin, $id_utilisateur, $couleur)
{
    global $conn;
    try {
        $query = "INSERT INTO rdv (id_medecin, id_utilisateurs, date_debut, date_fin, couleur)  
                  VALUES ($id_medecin, $id_utilisateur, '$date_debut', '$date_fin', '$couleur')";
        $result = mysqli_query($conn, $query);
        return ['success' => $result];
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

function getAllDoctors()
{
    global $conn;
    try {
        $query = "SELECT id_medecin, nom FROM medecin";
        $result = mysqli_query($conn, $query);
        return mysqli_fetch_all($result, MYSQLI_ASSOC);
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

function getRdvsByDoctor($id_medecin)
{
    global $conn;
    try {
        $query = "SELECT * FROM rdv WHERE id_medecin = $id_medecin";
        $result = mysqli_query($conn, $query);
        return mysqli_fetch_all($result, MYSQLI_ASSOC);
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

$action = $_GET['action'] ?? 'rdvs';
header('Content-Type: application/json');

switch ($action) {
    case 'doctors':
        echo json_encode(getAllDoctors());
        break;
    case 'getRdvsByDoctor':
        $id = $_GET['id_medecin'] ?? null;
        if ($id !== null) {
            echo json_encode(getRdvsByDoctor($id));
        } else {
            echo json_encode(['error' => 'id_medecin manquant']);
        }
        break;
    case 'rdvs':
    default:
        echo json_encode(getAllRdvs());
        break;
}
?>