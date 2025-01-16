const dateString = new Date().toLocaleDateString("fr-FR")
const [day, month, year] = dateString.split('/').map(Number)
const date = new Date(year, month - 1, day)

var indice_jour = date.getDay()

var offsetjour = 0;
if (indice_jour == 0) {
    indice_jour = 7
}

var main = document.getElementById("main_cal")
var listeJour = ["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"]




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
        
        creation_crenau(i,div_jour,datetemp)
    
    
        if (i == 0) {
            div_jour.classList.add("border_bottom_top_left")
        } else if (i == 6) {
            div_jour.classList.add("border_bottom_top_right")
            div_jour.classList.add("border_right")
        }
    }
}


function maj_jour() {
    console.log("rdef")
    let jours = document.querySelectorAll(".datejour > p")
    jours.forEach((e, index) => {
        let datetemp = new Date();
        datetemp.setDate(date.getDate()+index+offsetjour+1-indice_jour);
        let date_jour = datetemp.toLocaleDateString();
        ;
        e.innerText = listeJour[index] + "\n" + date_jour;
    })
}



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
    }
}


function create_rdv(horaire_debut,horaire_fin,journee,color="yellow") {
    for (let i = horaire_debut; i<=horaire_fin; i++) {
        var creneau_horaire = document.getElementById(journee.toString()+i.toString())
        creneau_horaire.style.backgroundColor = color

        if (i%6 == 0 && i != horaire_debut) {
            creneau_horaire.style.borderTop = "solid 1px "+color
        } 

        if (i == horaire_debut && i%6 !=0) {
            creneau_horaire.classList.add("invisible_border_top")
        }
        
        if (i == horaire_fin && i%6 == 0) {
            creneau_horaire.classList.add("invisible_border_bottom")
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
creation_jour()
create_rdv(0,71,lundi,"blue")
create_rdv(31,48,jeudi)
create_rdv(51,60,jeudi,"green")
create_rdv(6,11,dimanche,"red")



const buttonG = document.createElement('button');
buttonG.textContent = 'Apply transition_cal_g';
const buttonD = document.createElement('button');
buttonD.textContent = 'Apply transition_cal_d';

document.body.appendChild(buttonG);
document.body.appendChild(buttonD);

const box = document.querySelectorAll("#j");

// Add event listeners to the buttons
buttonG.addEventListener('click', () => {
    offsetjour -= 7;
    console.log(offsetjour);
    box.forEach(element => {
        element.classList.add('transition_cal_g');
        setTimeout(_ => {
            element.classList.remove('transition_cal_g');
        },1000);
    });
    //setTimeout(maj_jour(),1000);
    
});

buttonD.addEventListener('click', () => {
    offsetjour += 7;
    console.log(offsetjour);
    maj_jour();
    box.forEach(element => {
        element.classList.add('transition_cal_d');
        
        setTimeout(_ => {
            element.classList.remove('transition_cal_d');
        },1000);
    });
    //setTimeout(maj_jour(),1000);
});
