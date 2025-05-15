<?php
// Disable error reporting and output buffering to prevent unexpected output
error_reporting(0);
ini_set('display_errors', 0);

include_once "../index/db_connect.php";

function indisp_repet($id_medecin, $journee, $heure_debut, $heure_fin)
{
    global $conn;
    try {
        // Delete conflicting appointments first
        delete_conflicting_recurring_appointments($id_medecin, $journee, $heure_debut, $heure_fin);
        
        // Then create the unavailability
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
        // Delete conflicting appointments first
        delete_conflicting_temporary_appointments($id_medecin, $debut_periode, $fin_periode);
        
        // Then create the unavailability
        $query = "INSERT INTO IndisponibiliteTemporaire (id_medecin, debut_periode, fin_periode)  
                  VALUES ($id_medecin, '$debut_periode', '$fin_periode')";
        $result = mysqli_query($conn, $query);
        return ['success' => $result];
    } catch (Exception $e) {
        return ['error' => $e->getMessage()];
    }
}

function delete_conflicting_temporary_appointments($id_medecin, $debut_periode, $fin_periode) 
{
    global $conn;
    
    // Find and delete all appointments that overlap with the unavailability period
    $delete_query = $conn->prepare("
        DELETE FROM rdv 
        WHERE id_medecin = ? 
        AND (
            (date_debut < ? AND date_fin > ?) OR
            (date_debut >= ? AND date_debut < ?)
        )
    ");
    
    $delete_query->bind_param(
        "issss",
        $id_medecin,
        $fin_periode,
        $debut_periode,
        $debut_periode,
        $fin_periode
    );
    
    $delete_query->execute();
    $affected_rows = $delete_query->affected_rows;
    
    return $affected_rows;
}

function delete_conflicting_recurring_appointments($id_medecin, $journee, $heure_debut, $heure_fin) 
{
    global $conn;
    
    // Convert journee to uppercase to ensure consistent lookup
    $journee = strtoupper($journee);
    
    // Map of day abbreviations to corresponding weekday numbers (MySQL DAYOFWEEK function)
    $jour_map = [
        'LUN' => 2, // Monday = 2 in MySQL
        'MAR' => 3, // Tuesday = 3 in MySQL
        'MER' => 4, // Wednesday = 4 in MySQL
        'JEU' => 5, // Thursday = 5 in MySQL
        'VEN' => 6, // Friday = 6 in MySQL
        'SAM' => 7, // Saturday = 7 in MySQL
        'DIM' => 1  // Sunday = 1 in MySQL
    ];
    
    $weekday_number = $jour_map[$journee] ?? null;
    
    if ($weekday_number === null) {
        return 0; // Invalid day
    }
    
    // Find and delete all appointments on that day of the week that overlap with the time period
    $delete_query = $conn->prepare("
        DELETE FROM rdv 
        WHERE id_medecin = ? 
        AND DAYOFWEEK(date_debut) = ?
        AND (
            (TIME(date_debut) < ? AND TIME(date_fin) > ?) OR
            (TIME(date_debut) >= ? AND TIME(date_debut) < ?)
        )
    ");
    
    $delete_query->bind_param(
        "iissss",
        $id_medecin,
        $weekday_number,
        $heure_fin,
        $heure_debut,
        $heure_debut,
        $heure_fin
    );
    
    $delete_query->execute();
    $affected_rows = $delete_query->affected_rows;
    
    return $affected_rows;
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
        
        // Make sure we have all required parameters
        if ($id_medecin === null || $journee === null || $heure_debut === null || $heure_fin === null) {
            echo json_encode(['error' => 'Missing required parameters']);
            break;
        }
        
        echo json_encode(indisp_repet($id_medecin, $journee, $heure_debut, $heure_fin));
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
}

?>