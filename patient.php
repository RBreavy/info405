<?php
session_start();

// Vérification de sécurité
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'patient') {
    header("Location: index.html");
    exit();
}

// Récupération du nom depuis la session
$nom = htmlspecialchars($_SESSION['nom']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="style_utilisateur.css">
    <title>Patient</title>
</head>
<body>
    <div class="banner">
        <img src="logo.png" alt="Logo" class="banner-logo">
        <div class="dropdown">
                <button class="dropbtn">Menu</button>
                <div class="dropdown-content">
                    <a href="contact.html">Contact</a>
                    <a href="logout.php">Deconnexion</a>
                </div>
            </div>
        </div>
    </div>

    <div id="welcome-message" style="margin: 20px; font-size: 18px;">Bienvenue, <?php echo $nom; ?></div>

    <section class="main_cal">
        <article class = "selecteur">
            <article class = "selecteur_gauche">
            </article>
            <input type="date" id="calendrier" name="cal"/>
            <article class = "selecteur_droit"></article>
        </article>
    </section>

    <section class="bouton_docteur">
        <article class = "docteur">
        </article>
    </section>
   
</body>
<script src = "calendrier\calendrier.js"></script>
<script src = "JS/patient.js"></script>
</html>