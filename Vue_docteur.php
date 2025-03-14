<?php
session_start();

// Vérification de sécurité
if (!isset($_SESSION['user_id']) || !isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'medecin') {
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
    <title>Document</title>
    <style>
        .sidenav {
            height: 100%;
            width: 250px;
            position: fixed;
            left: -250px;
            top: 0;
            background-color: #111;
            padding-top: 20px;
            transition: 0.3s;
            z-index: 1;
        }

        .sidenav a {
            padding: 10px 20px;
            text-decoration: none;
			margin-top: 40px;
            font-size: 18px;
            color: white;
            display: block;
            transition: 0.3s;
        }

        .sidenav a:hover {
            background-color: #575757;
        }

        .sidenav .closebtn {
            position: absolute;
            top: 10px;
            left: 15px;
            font-size: 24px;
            margin-bottom: 20px;
            color: white;
            cursor: pointer;
        }

        .menu-icon {
            font-size: 30px;
            cursor: pointer;
            position: relative;
            color: white;
            display: inline-block;
        }
        
    </style>
</head>
<body>
    <div class="banner">
        <img src="logo.png" alt="Logo" class="banner-logo">
        <span class="menu-icon" onclick="openNav()">☰</span>
    </div>
    
    <div id="mySidenav" class="sidenav">
        <button class="closebtn" onclick="closeNav()">X</button>
        <a href="contact.html" class="buttons">Contact</a>,
        <a href="logout.php" class="buttons">Déconnexion</a>
    </div>

    <div id="welcome-message" style="margin: 20px; font-size: 18px;">Bienvenue, Dr. <?php echo $nom; ?></div>

    <section class="main_cal">
        <article class="selecteur">
            <article class="selecteur_gauche"></article>
            <input type="date" id="calendrier" name="cal"/>
            <article class="selecteur_droit"></article>
        </article>
    </section>

    <script>
        function openNav() {
            document.getElementById("mySidenav").style.left = "0";
        }

        function closeNav() {
            document.getElementById("mySidenav").style.left = "-250px";
        }
    </script>

</body>
<script src = "calendrier\calendrier.js"></script>
</html>