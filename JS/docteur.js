
function changeSelection(jour) {
    document.querySelectorAll(".selected").forEach(e => {
        e.classList.remove("selected");
    });
    let temp = document.querySelector("."+jour);
    console.log("temp");
    temp.classList.add("selected");
}

function openNav() {
    document.getElementById("mySidenav").style.left = "0";
}

function closeNav() {
    document.getElementById("mySidenav").style.left = "-250px";
}


document.addEventListener('DOMContentLoaded', function() {
    
    setTimeout(function() {
        const jourElements = document.querySelectorAll('.jour');
        const formIndisp = document.querySelector('.form-indisp');
        
        if (jourElements.length > 0 && formIndisp) {
            const lastJour = jourElements[jourElements.length - 1];
            
            if (lastJour.nextSibling) {
                lastJour.parentNode.insertBefore(formIndisp, lastJour.nextSibling);
            } else {
                lastJour.parentNode.appendChild(formIndisp);
            }
        }
    }, 100);
});