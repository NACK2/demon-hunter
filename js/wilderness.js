// WILDNERESS IS INSPIRED BY POKEMON

const NUM_BUSHES = 15;
const exitBtn = document.querySelector("#exitBtn");
const land = document.querySelector("#land");

exitBtn.onclick = gameMenu;

function gameMenu() {
    window.location = "game.html";
}

function createBushes() {
    for (let i=0; i<NUM_BUSHES; ++i) { 
        const div = document.createElement("div"); // creating element 
        div.id = "bush"; // giving element the bush id
        div.style.left = Math.random() * 100 + "%"; // random distance from left and top of screen
        div.style.top = Math.random() * 100 + "%";
        land.appendChild(div);
    }
}
createBushes();