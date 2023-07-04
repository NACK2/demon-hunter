const quitBtn = document.querySelector("#quit-btn");
quitBtn.onclick = quit;

function quit() {
    window.location = "index.html";
}

// TO-DO: 
// - make inventory a drop down menu, lists items in inventory in the dropdown options
// - create bunch of buttons for different paths: go to town, go to store, go to boss fight, go to mine, etc