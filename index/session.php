<?php
//permet de récup le nom d'un patient
session_start();

if (isset($_SESSION['nom'])) {
    echo json_encode(["nom" => $_SESSION['nom']]);
} else {
    echo json_encode(["nom" => null]);
}
?>