const dateString = new Date().toLocaleDateString("fr-FR")

const [day, month, year] = dateString.split('/').map(Number)
const date = new Date(year, month - 1, day)
var indice_jour = date.getDay()

console.log("debug")

if (indice_jour == 0) {
    indice_jour = 7
}

var main = document.getElementById("main_cal")




function create(tag,container,text=null){
    element = document.createElement(tag);
    if (text){
        element.innerText=text;
    }
    container.appendChild(element);
    return element;
}

var listeJour = ["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"]


for (let i = 0 ; i<7 ; i++) {
    var datetemp = new Date();
    datetemp.setDate(date.getDate()+i+1-indice_jour)


    var div_jour = create("div",main)
    var article = create("article",div_jour)
    var t = create("p",article,listeJour[i]+"\n"+datetemp.toLocaleDateString())
    var heure = 8;



    for (let j = 0 ; j<72 ; j++) {
        var creneau = create("article",div_jour)
        creneau.id = datetemp.toLocaleDateString() + j.toString()
        creneau.classList.add("creneau")
        
        if (i == 0 && j%6 == 0) {
            var carre_heure = create("div",creneau)
            carre_heure.classList.add("carre_heure")
            
            var texte = create("p",carre_heure,heure+"h00")
            heure = heure+1
            texte.classList.add("heure")
        } 

        if (Math.floor(j / 3) % 2 == 0) {
            creneau.style.backgroundColor = "#586f7c"
        } else {
            creneau.style.backgroundColor = "#b8dbd9"
        }

        if (j%6 == 0) {
            creneau.style.borderTop = "solid 1px black"
        }





        if (j == 71) {
            if (i == 0) {
                creneau.style.borderBottomLeftRadius = "5px"
            } else if (i == 6) {
                creneau.style.borderBottomRightRadius = "5px"
            }
            
        }


    }

    if (i == 0) {
        div_jour.style.borderBottomLeftRadius = "5px"
        div_jour.style.borderTopLeftRadius = "5px"
    }

    if (i == 6) {
        div_jour.style.borderBottomRightRadius = "5px"
        div_jour.style.borderTopRightRadius = "5px"
        div_jour.style.borderRight = "solid 1px black"
    }
    article.id = "datejour"
    div_jour.id = "j";
}



function create_rdv(horaire_debut,horaire_fin,journee,color="yellow") {
    for (let i = horaire_debut; i<=horaire_fin; i++) {
        console.log(journee.toString()+i.toString())
        let creneau_horaire = document.getElementById(journee.toString()+i.toString())
        creneau_horaire.style.backgroundColor = color

        if (i%6 == 0 && i != horaire_debut) {
            creneau_horaire.style.borderTop = "solid 1px "+color
        }
        
    }
}


var lundi = "13/01/2025"
var mardi = "14/01/2025"
var mercredi = "15/01/2025"
var jeudi = "16/01/2025"
var vendredi = "17/01/2025"
var samedi = "18/01/2025"
var dimanche = "19/01/2025"
create_rdv(0,71,lundi,"blue")
create_rdv(31,48,jeudi)
create_rdv(51,60,jeudi,"green")
create_rdv(6,11,dimanche,"red")