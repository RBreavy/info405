console.log("test")
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
    var divt = create("div",main)
    var article = create("article",divt)
    var t = create("p",article,listeJour[i])
    for (let j = 0 ; j<72 ; j++) {
        var horaire = create("article",divt)
        horaire.id = i.toString() + j.toString()
        horaire.classList.add("horaire")
        if (j%2 == 0) {
            horaire.style.backgroundColor = "#586f7c"
            var heure = (Math.floor(j/6)+8)+"h00"
        } else {
            horaire.style.backgroundColor = "#b8dbd9"
            var heure = (Math.floor(j/6)+8)+"h30"
        }

        if (j%3 == 0) {
            var texte = create("p",horaire,heure)
            texte.classList.add("heure")
        }

    }
    article.id = "datejour"
    divt.id = "j";
}
