
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

document.addEventListener('DOMContentLoaded', function() {
    // No need to move the form since it's already outside the calendar in the HTML
    setTimeout(function() {
        const formIndisp = document.querySelector('.form-indisp');
        if (formIndisp) {
            formIndisp.style.display = 'block'; // Make sure it's visible
        }
    }, 150);
});

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

// vvv
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.querySelectorAll('.rdv').forEach(rdv => {
            if (!rdv.className.includes('light') && !rdv.className.includes('red')) {
                rdv.classList.add('lightgreen'); 
            }
        });
    }, 1000);
});