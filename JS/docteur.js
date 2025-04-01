
function changeSelection(jour) {
    document.querySelectorAll(".selected").forEach(e => {
        e.classList.remove("selected");
    });
    let temp = document.querySelector("."+jour);
    console.log("temp");
    temp.classList.add("selected");
}

// Menu functionality
function openNav() {
    document.getElementById("mySidenav").style.left = "0";
}

function closeNav() {
    document.getElementById("mySidenav").style.left = "-250px";
}

// Move form to the right of the last jour element
document.addEventListener('DOMContentLoaded', function() {
    // This function runs after the calendar is created
    // It will ensure the form-indisp is positioned correctly
    
    setTimeout(function() {
        const jourElements = document.querySelectorAll('.jour');
        const formIndisp = document.querySelector('.form-indisp');
        
        // If calendar and form exist
        if (jourElements.length > 0 && formIndisp) {
            // Move the form after the last jour element in the DOM
            const lastJour = jourElements[jourElements.length - 1];
            
            if (lastJour.nextSibling) {
                lastJour.parentNode.insertBefore(formIndisp, lastJour.nextSibling);
            } else {
                lastJour.parentNode.appendChild(formIndisp);
            }
        }
    }, 100); // Small delay to ensure calendar is rendered
});