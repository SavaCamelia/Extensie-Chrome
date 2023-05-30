// When the user clicks on div, open the popup
function myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
  }
  
  document.getElementById("triggerButton").onclick = function() {
    window.open(chrome.runtime.getURL("test.html"));
  }
