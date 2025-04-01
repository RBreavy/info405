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
    <link rel="stylesheet" href="calendrier/calendrier.css">
    <title>Document</title>
    
</head>
<body>
    <div class="banner">
        <img src="logo.png" alt="Logo" class="banner-logo">
        <span class="menu-icon" onclick="openNav()">☰</span>
    </div>
    
    <div id="mySidenav" class="sidenav">
        <button class="closebtn" onclick="closeNav()">X</button>
        <a href="contact.html" class="buttons">Contact</a>
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

    <div class="form-box">
        <div class="tabs">
            <button id="tab-repetitif" class="tab active" onclick="toggleForm('repetitif')">RÉPÉTITIF</div>
            <button id="tab-temporaire" class="tab inactive" onclick="toggleForm('temporaire')">TEMPORAIRE</div>
        </div>

    <div id="form-repetitif">
        <input type="radio" id="lundi" name="jour" value="lundi" checked>
        <label for="lundi">Lun</label>
        
        <input type="radio" id="mardi" name="jour" value="mardi">
        <label for="mardi">Mar</label>
        
        <input type="radio" id="mercredi" name="jour" value="mercredi">
        <label for="mercredi">Mer</label>
        
        <input type="radio" id="jeudi" name="jour" value="jeudi">
        <label for="jeudi">Jeu</label>
        
        <input type="radio" id="vendredi" name="jour" value="vendredi">
        <label for="vendredi">Ven</label>
        
        <input type="radio" id="samedi" name="jour" value="samedi">
        <label for="samedi">Sam</label>
        
        <input type="radio" id="dimanche" name="jour" value="dimanche">
        <label for="dimanche">Dim</label>
        <label>Heure début :</label>
        <input type="time" min="08:00" max="20:00">
        <label>Heure fin :</label>
        <input type="time" min="08:00" max="20:00">
        <button class="submit-button" onclick="recupForm()">ENVOYER</button>
    </div>
        
        <div id="form-temporaire" class="hidden">
            <label>Jour début :</label>
            <input type="date">
            <label>Jour fin :</label>
            <input type="date">
            <label>Heure début :</label>
            <input type="time" min="08:00" max="20:00">
            <label>Heure fin :</label>
            <input type="time" min="08:00" max="20:00">
            <button class="submit-button" onclick="recupForm()">ENVOYER</button>
        </div>
    </div>

</body>
<script src = "calendrier/calendrier.js"></script>
<script src = "form_doc.js"></script>
<script src = "JS/docteur.js"></script>
</html>


        /* Style minimaliste pour les boutons jours */
        .days-selector {
            display: flex;
            gap: 5px;
            margin: 20px;
        }

        /* Cacher les boutons radio originaux */
        .days-selector input[type="radio"] {
            opacity: 0;
            position: absolute;
        }

        /* Style pour les labels qui serviront de boutons */
        .days-selector label {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 40px;
            border: 1px solid #3498db;
            border-radius: 50%;
            color: #3498db;
            cursor: pointer;
        }

        /* Style pour le label quand le bouton radio est sélectionné */
        .days-selector input[type="radio"]:checked + label {
            background-color: #3498db;
            color: white;
        }


</body>
</html>