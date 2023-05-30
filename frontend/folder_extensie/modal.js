// Get the modal

function initializare_modal() {
    preturiModal = document.getElementsByClassName("extensie-modal")[0];

    // Get the button that opens the modal
    //var btn = document.getElementById("myBtn");
    


    
    // When the user clicks on the button, open the modal
    //btn.onclick = function() {
    //  preturiModal.style.display = "block";
    //}
    


    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == preturiModal) {
        preturiModal.style.display = "none";
      }
    }
}

var preturiModal;
