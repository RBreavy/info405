<?php
error_reporting(0);
ini_set('display_errors', 0);

include_once "../index/db_connect.php";

function getAllRdvs($start = null, $end = null)
{
    global $conn;
    $id_utilisateur = $_SESSION['user']['id_utilisateurs'] ?? null;

    if (!$id_utilisateur) {
        return ['error' => 'Utilisateur non connecté'];
    }

    try {
        $where = "WHERE r.id_utilisateurs = $id_utilisateur"; // ← Filtrage de base par utilisateur

        if ($start !== null && $end !== null) {
            $start = DateTime::createFromFormat('d/m/Y', $start)->format('Y-m-d');
            $end = DateTime::createFromFormat('d/m/Y', $end)->format('Y-m-d');

            $start = mysqli_real_escape_string($conn, $start);
            $end = mysqli_real_escape_string($conn, $end);

            $where .= " AND r.date_debut >= '$start' AND r.date_debut <= '$end'";
        }

        $query = "SELECT m.nom AS nom_medecin, u.nom AS nom_utilisateur, 
                         r.date_debut, r.date_fin, r.couleur,
                         TIMESTAMPDIFF(MINUTE, r.date_debut, r.date_fin) AS duration
                  FROM rdv r
                  JOIN medecin m ON r.id_medecin = m.id_medecin 
                  JOIN utilisateurs u ON r.id_utilisateurs = u.id_utilisateurs
                  $where";
        $result = mysqli_query($conn, $query);

        $rdvs = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $rdvs[] = $row;
        }
        return $rdvs;

    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

function creer_rdv($id_medecin, $date_debut, $date_fin, $id_utilisateur, $couleur)
{
    global $conn;
    try {
        $query = "SELECT debut_periode, fin_periode FROM IndisponibiliteTemporaire WHERE id_medecin = $id";
        $result = mysqli_query($conn, $query);
        return mysqli_fetch_all($result, MYSQLI_ASSOC);
    } catch (Exception $e) {
        return ["error"=> $e->getMessage()];
    }
}

function getAllIndispR($id) 
{
    global $conn;
    try {
        $query = "SELECT journee, heure_debut, heure_fin FROM IndisponibiliteRepetitive WHERE id_medecin = $id";
        $result = mysqli_query($conn, $query);
        return mysqli_fetch_all($result, MYSQLI_ASSOC);
    } catch (Exception $e) {
        return ["error"=> $e->getMessage()];
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
        $start = $_GET['start_date'] ?? null;
        $end = $_GET['end_date'] ?? null;
        echo json_encode(getAllRdvs($start, $end));
        break;
    case 'getIT':
        $id = $_GET['id_medecin'];
        echo json_encode(getAllIndispT($id));
        break;
    case 'getIR':
        $id = $_GET['id_medecin'];
        echo json_encode(getAllIndispR($id));
        break;
}
?>