const dateString = new Date().toLocaleDateString("fr-FR")

const [day, month, year] = dateString.split('/').map(Number)
const date = new Date(year, month - 1, day)
const indice_jour = date.getDay()

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
    console.log(date)
    console.log("test")


    var div_jour = create("div",main)
    var article = create("article",div_jour)
    var t = create("p",article,listeJour[i]+"\n"+datetemp.toLocateDateString())



    for (let j = 0 ; j<72 ; j++) {
        var creneau = create("article",div_jour)
        creneau.id = i.toString() + j.toString()
        creneau.classList.add("creneau")
        if (i == 0 && j%6 == 0) {
            var carre_heure = create("div",creneau)
            carre_heure.classList.add("carre_heure")
            var heure = (Math.floor(j/6)+8)+"h00"
            var texte = create("p",carre_heure,heure)
            texte.classList.add("heure")
        } 

        if (Math.floor(j / 3) % 2 == 0) {
            creneau.style.backgroundColor = "#586f7c"
        } else {
            creneau.style.backgroundColor = "#b8dbd9"
        }

        if (j%3 == 0) {
            
            
            
            if (j%2 == 0) {
                creneau.style.borderTop = "solid 1px black"
            }
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
