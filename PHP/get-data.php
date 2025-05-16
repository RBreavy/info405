<?php
error_reporting(0);
ini_set('display_errors', 0);
session_start();

include_once "../index/db_connect.php";



function getRdvByIdMed($id) {
    global $conn;
    try {
        $query = "SELECT r.couleur, r.date_debut, r.date_fin, r.id_rdv, u.nom 
        FROM rdv r
        JOIN utilisateurs u ON r.id_utilisateurs = u.id_utilisateurs
        WHERE id_medecin = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        return $data;
    } catch (Exception $e) {
        return ["error" => "Une erreur est survenue"];
    }
}

function getRdvByIdPat($id) {
    global $conn;
    try {
        $query = "SELECT r.couleur, r.date_debut, r.date_fin, r.id_rdv, m.nom 
        FROM rdv r
        JOIN medecin m ON r.id_medecin = m.id_medecin
        WHERE id_utilisateurs = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        return $data;
    } catch (Exception $e) {
        return ["error" => "Une erreur est survenue"];
    }
}

function getAllIndispR($id) 
{
    global $conn;
    try {
        $query = "SELECT journee, heure_debut, heure_fin FROM IndisponibiliteRepetitive WHERE id_medecin = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        return $data;
    } catch (Exception $e) {
        return ["error" => "Une erreur est survenue"];
    }
}

function getAllIndispT($id) 
{
    global $conn;
    try {
        $query = "SELECT debut_periode, fin_periode FROM IndisponibiliteTemporaire WHERE id_medecin = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        return $data;
    } catch (Exception $e) {
        return ["error" => "Une erreur est survenue"];
    }
}

function getAllDoctors()
{
    global $conn;
    try {
        $query = "SELECT id_medecin, nom FROM medecin";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        return $data;
    } catch (Exception $e) {
        return ['error' => "Une erreur est survenue"];
    }
}

function isRdvOwnedByUser($user_id, $rdv_id) {
    global $conn;
    
    try {
        $query = "SELECT COUNT(*) AS count FROM rdv WHERE id_rdv = ? AND id_utilisateurs = ?";
        $stmt = $conn->prepare($query);
        
        if (!$stmt) {
            return false;
        }
        
        $stmt->bind_param("ii", $rdv_id, $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $stmt->close();
        
        return ($row['count'] > 0);
        
    } catch (Exception $e) {
        // Log error but don't expose details
        return ['error' => "Une erreur est survenue"];
    }
}

function getRdvsByDoctor($id_medecin)
{
    global $conn;
    try {
        $query = "SELECT id_rdv, couleur, date_debut, date_fin FROM rdv WHERE id_medecin = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $id_medecin);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        return $data;
    } catch (Exception $e) {
        return ['error' => "Une erreur est survenue"];
    }
}

$action = $_GET['action'] ?? 'rdvs';
header('Content-Type: application/json');

// Valider les paramètres
$id_medecin = isset($_GET['id_medecin']) ? (int)$_GET['id_medecin'] : null;
$id_patient = isset($_GET['id_patient']) ? (int)$_GET['id_patient'] : null;
$start = isset($_GET['start_date']) ? $_GET['start_date'] : null;
$end = isset($_GET['end_date']) ? $_GET['end_date'] : null;
$id_rdv = isset($_GET['id_rdv']) ? (int)$_GET['id_rdv'] : null;

switch ($action) {
    case 'doctors':
        echo json_encode(getAllDoctors());
        break;
    case 'getRdvsByDoctor':
        if ($id_medecin !== null) {
            echo json_encode(getRdvsByDoctor($id_medecin));
        } else {
            echo json_encode(['error' => 'id_medecin manquant']);
        }
        break;
    /*case 'rdvs':
        echo json_encode(getAllRdvs($start, $end, $id_medecin, $id_patient));
        break;
    */
    case 'getRdvById':
        if (($id_patient !== null && $id_medecin === null) || ($id_patient === null && $id_medecin !== null)) {
            if ($id_patient !== null && $id_patient === $_SESSION['user_id']) {
                echo json_encode(getRdvByIdPat($id_patient));
            } else if ($_SESSION['user_id'] === $id_medecin) {
                echo json_encode(getRdvByIdMed($id_medecin));
            } else {
                echo json_encode(['error'=> $_SESSION['user_id']]);
            }
            
        } else {
            echo json_encode(['error' => 'doit contenir soit id_patient soit id_medecin']);
        }
        
        break;
    case 'getIT':
        if ($id_medecin !== null) {
            echo json_encode(getAllIndispT($id_medecin));
        } else {
            echo json_encode(['error' => 'id_medecin manquant']);
        }
        break;
    case 'getIR':
        if ($id_medecin !== null) {
            echo json_encode(getAllIndispR($id_medecin));
        } else {
            echo json_encode(['error' => 'id_medecin manquant']);
        }
        break;
    case 'rdvOwnByUser':
        if ($id_patient !== null && $id_rdv !== null) {
            echo json_encode(isRdvOwnedByUser($id_patient, $id_rdv));
        } else {
            echo json_encode(['error'=> 'id_medecin où id_patient manquant']);
        }
        break;
    default:
        echo json_encode(['error' => 'Action non reconnue']);
}
?>