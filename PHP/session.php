<?php
//permet de récup le nom d'un patient
session_start();

if (isset($_SESSION['nom'])) {
    echo json_encode(["nom" => $_SESSION['nom']]);
} else {
    echo json_encode(["nom" => null]);
}

function generateCSRFToken()
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}
?>