const dateString = new Date().toLocaleDateString("fr-FR")
var [day, month, year] = dateString.split('/').map(Number)
var date = new Date(year, month - 1, day)

var indice_jour = date.getDay()

var offsetjour = 0;
if (indice_jour == 0) {
    indice_jour = 7
}




var dateInput = document.getElementById("calendrier");
dateInput.addEventListener('change', _ => {
    [year, month, day] = dateInput.value.split("-").map(Number);
    if (2000 <= year && year <= 2100) {
        console.log(2000 <=year);
        dateInput.value = "";
        date = new Date(year, month - 1, day);
        indice_jour = date.getDay();
        offsetjour = 0;
        maj_semaine();
    } 
});




var main = document.getElementsByClassName("main_cal")[0]
var listeJour = ["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"]

var lundi = "13/01/2025"
var jeudi = "16/01/2025"
var dimanche = "19/01/2025"

var mardi = "21/01/2025"
var mercredi = "22/01/2025"

var vendredi = "10/01/2025"
var samedi = "17/02/2025"
creation_jour()


var listeCreneau = [
    () => create_rdv(0, 71, lundi, "blue"),
    () => create_rdv(31, 17, jeudi),
    () => create_rdv(51, 9, jeudi, "green"),
    () => create_rdv(6, 5, dimanche, "red"),

    () => create_rdv(39, 6, mardi, "blue"),
    () => create_rdv(14, 4, mercredi,"aqua"),

    () => create_rdv(21, 17, vendredi, "white"),
    () => create_rdv(41, 9, vendredi, "purple"),
    () => create_rdv(6, 5, samedi, "orange", "docteur Dupont")
];

listeCreneau.forEach(func => func());


function create(tag,container,text=null){
    element = document.createElement(tag);
    if (text){
        element.innerText=text;
    }
    container.appendChild(element);
    return element;
}


function creation_jour() {
    for (let i = 0 ; i<7 ; i++) {
        let datetemp = new Date();
        datetemp.setDate(date.getDate()+i+1-indice_jour);
    
    
        let div_jour = create("div",main);
        div_jour.classList.add("jour");
    
        let article = create("article",div_jour);
        article.classList.add("datejour");
    
        let date_jour = datetemp.toLocaleDateString();
        create("p",article,listeJour[i]+"\n"+date_jour);
        div_jour.id = date_jour;
        
        creation_crenau(i,div_jour,datetemp)
    
    
        if (i == 0) {
            div_jour.classList.add("border_bottom_top_left")
        } else if (i == 6) {
            div_jour.classList.add("border_bottom_top_right")
            div_jour.classList.add("border_right")
        }
    }
}


function maj_semaine() {
    maj_date();
    maj_id();
    maj_rdv();
}

function maj_date() {
    let jours = document.querySelectorAll(".jour");
    jours.forEach((e, index) => {
        let datetemp = new Date(year,month-1,day);
        datetemp.setDate(date.getDate()+index+offsetjour+1-indice_jour);
        let date_jour = datetemp.toLocaleDateString();
        e.id = date_jour;
        let dj = e.querySelector(".datejour > p");
        dj.innerText = listeJour[index] + "\n" + date_jour;
    })
}

function maj_id() {
    let jour = document.querySelectorAll(".jour");
    jour.forEach(e => {
        let lC = e.querySelectorAll(".creneau");
        lC.forEach((creneau,index) => {
            creneau.id = e.id+index;
        });
    });
}

function maj_rdv() {
    let rdv = document.querySelectorAll(".rdv");
    rdv.forEach(e => {

        e.remove();
    });

    let rdv_color = document.querySelectorAll(".custom_bg_color");
    rdv_color.forEach(e => {
        e.classList.remove("custom_bg_color");
        e.classList.remove('custom_border_top');
        e.classList.remove("invisible_border_top");
        e.classList.remove("invisible_border_bottom");
    })
    listeCreneau.forEach(func => func());
}

var test = true;


function creation_crenau(indice_div_jour,div_jour,datetemp) {
    let heure = 8;
    for (let j = 0 ; j<72 ; j++) {
        let article_creneau = create("article",div_jour)
        article_creneau.id = datetemp.toLocaleDateString() + j.toString()
        article_creneau.classList.add("creneau")
        if (Math.floor(j / 3) % 2 == 0) {
            article_creneau.classList.add("gris_fonce")
        } else {
            article_creneau.classList.add("gris_clair")
        }
        
        if (indice_div_jour == 0 && j%6 == 0) {
            let carre_heure = create("div",article_creneau)
            carre_heure.classList.add("carre_heure")
            let texte = create("p",carre_heure,heure+"h00")
            heure = heure+1
            texte.classList.add("heure")
        } 

        if (j%6 == 0) {
            article_creneau.classList.add("border_top")
        }

        if (j == 71) {
            if (indice_div_jour == 0) {
                article_creneau.classList.add("article_border_bottom_left_radius")
            } else if (indice_div_jour == 6) {
                article_creneau.classList.add("article_border_bottom_right_radius")
            }
        }

        article_creneau.addEventListener("click", _ => {
            console.log(article_creneau.id)
            setTimeout(test=false, 2000)
        })
    }
}

let lrdv;

async function fetchAndSaveData() {
 try {
   const response = await fetch('calendrier/get-data.php?action=doctors');
   lrdv = await response.json();
   processData();
 } catch(error) {
   console.error(error);
 }
}

function processData() {
 lrdv.forEach(e => {
   console.log(e);
 });
}

fetchAndSaveData();


function calcul_duree(heure_debut,duree) {
    let h_dbt_rdv = (8+Math.floor((heure_debut+1)/6)).toString()+"h"
    let m_dbt_rdv = (heure_debut%6).toString()
    let h_fin_rdv = (8+Math.floor((heure_debut+duree+1)/6)).toString()+"h"
    let m_fin_rdv = ((heure_debut+duree+1)%6).toString()
    if (m_dbt_rdv.length == 1) {
        m_dbt_rdv = m_dbt_rdv + "0";
    }

    if (m_fin_rdv.length == 1) {
        m_fin_rdv = m_fin_rdv + "0";
    }
    
    return (h_dbt_rdv+m_dbt_rdv+" - "+h_fin_rdv+m_fin_rdv)
}



function create_rdv(horaire_debut,duree,journee,color="yellow",texte) {
    let horaire_fin = horaire_debut+duree;
    if (horaire_debut>-1 && horaire_fin<72 && document.getElementById(journee) !== null) {
        for (let i = horaire_debut; i<=horaire_fin; i++) {
            var creneau_horaire = document.getElementById(journee.toString()+i.toString())
            creneau_horaire.style.setProperty('--border-color', color);
            creneau_horaire.classList.add("custom_bg_color");
            
            if (i == horaire_debut) {
                let box_invisible = create("article",creneau_horaire);
                create("p",box_invisible,texte);
                create("p",box_invisible,calcul_duree(horaire_debut,duree));
                box_invisible.classList.add("rdv")
                box_invisible.style.height = creneau_horaire.offsetHeight* (duree+1) -3+"px";
            }
            
    
            if (i%6 == 0 && i != horaire_debut) {
                creneau_horaire.classList.add('custom_border_top');
            } 
    
            if (i == horaire_debut && i%6 !=0) {
                creneau_horaire.classList.add("invisible_border_top")
            }
            
            if (i == horaire_fin && (i+1)%6 != 0) {
                console.log(i)
                creneau_horaire.classList.add("invisible_border_bottom")
            }
          
        }
    }
}



const boutonG = document.getElementsByClassName("selecteur_gauche")[0];
const boutonD = document.getElementsByClassName("selecteur_droit")[0];


const box = document.querySelectorAll(".jour");

boutonG.addEventListener('click', () => {
    offsetjour -= 7;
    box.forEach(element => {
        element.classList.remove('transition_cal_g');
        element.classList.add('transition_cal_g');
        setTimeout(_ => {
            element.classList.remove('transition_cal_g');
        },1000);
    });
    maj_semaine();
    
});

boutonD.addEventListener('click', () => {
    offsetjour += 7;
    box.forEach(element => {
        element.classList.remove('transition_cal_d');
        element.classList.add('transition_cal_d');
        
        setTimeout(_ => {
            element.classList.remove('transition_cal_d');
        },1000);
    });
    maj_semaine();
});
