// WILDNERESS IS INSPIRED BY POKEMON

const NUM_BUSHES = 15;
const exitBtn = document.querySelector("#exitBtn");
const land = document.querySelector("#land");
const player = document.querySelector("#player");

let landCoords = land.getBoundingClientRect(); // # of pixels land is from (0, 0) of the window
let playerCoords = player.getBoundingClientRect(); // # of pixels player is from (0, 0) of the window

const playerPos = {
    // since there is space between land and window dimensions, 
    // erasing that extra space to get player coords w.r.t. land and not player coords w.r.t. window
    x: parseInt(playerCoords.left - landCoords.left),
    y: parseInt(playerCoords.top - landCoords.top)
};
const playerVel = { // this is what will be used to move player
    x: 0, // - is left, + is right
    y: 0 // - is up, + is down
};

exitBtn.onclick = gameMenu;

function gameMenu() {
    window.location = "game.html";
}

function run() {
    playerPos.x += playerVel.x;
    playerPos.y += playerVel.y;

    player.style.left = playerPos.x + "px";
    player.style.top = playerPos.y + "px";
    // onsole.log("TEST");
    requestAnimationFrame(run); // will constantly call run() even when another function is running
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

function userMovement(e) {
    let validKey = true; 

    switch (e.key) {
        case 'w':
            if (player.offsetTop < landCoords.top) {
                playerVel.y = 0;
            }
            else {
                playerVel.y = -1; // USE SPEED 3 AS A RUNNING UPGRADE LATER
            }
            player.style.backgroundImage = "url('../img/wilderness/player_front.png')";
            break;

        case 'a':
            if (player.offsetLeft < landCoords.left) {
                playerVel.x = 0;
            }
            else {
                playerVel.x = -1;
            }
            player.style.backgroundImage = "url('../img/wilderness/player_left.png')";
            break;

        case 's':
            if (player.offsetTop + player.clientWidth > landCoords.bottom) {
                playerVel.y = 0;
            }
            else {
                playerVel.y = 1; // USE SPEED 3 AS A RUNNING UPGRADE LATER
            }
            player.style.backgroundImage = "url('../img/wilderness/player_back.png')";
            break;

        case 'd':
            if (player.offsetLeft + player.clientWidth > landCoords.right) {
                playerVel.x = 0;
            }
            else {
                playerVel.x = 1; // USE SPEED 3 AS A RUNNING UPGRADE LATER
            }
            player.style.backgroundImage = "url('../img/wilderness/player_right.png')";
            break;
        default:
            validKey = false;
            break;
    }

    // since userMovement() is called when ANY key is pressed, making sure running animation only plays for WASD
    if (validKey) { 
        player.classList.add("running"); 
    }
}
window.addEventListener("keydown", userMovement); // when any key is pressed userMovement() will be called

function userStopped(e) {
    playerVel.x = 0;
    playerVel.y = 0;
    player.classList.remove("running"); // running animation stops when key released
}
window.addEventListener("keyup", userStopped); // when any key is let go userStopped() will be called

function init() {
    createBushes();
    run();
}

init();
