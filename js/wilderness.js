import haveBoots from '../js/game.js'; // getting haveBoots variable from game.js
// console.log(JSON.parse(haveBoots));

const NUM_BUSHES = 15;
const NUM_SLIMES = 7;
let PLAYER_SPEED = 1; // will be set to 3 if haveBoots is true

const exitBtn = document.querySelector("#exitBtn");
const land = document.querySelector("#land");
const player = document.querySelector("#player");
const wildernessContainer = document.querySelector("#wildernessContainer"); // Container w/ everything on wilderness page
const battleContainer = document.querySelector("#battleContainer");
let slimes = []; // array of slime elements

let landCoords = land.getBoundingClientRect(); // # of pixels land is from (0, 0) of the window

const playerPos = {
    x: parseInt(player.getBoundingClientRect().left),
    y: parseInt(player.getBoundingClientRect().top)
};

const playerVel = { // this is what will be used to move player
    x: 0, // - is left, + is right
    y: 0 // - is up, + is down
};

function gameMenu() {
    window.location = "game.html";
}

function checkCollision(mob) { // returns true if player and the parameter mob are colliding
    let mobCoords = mob.getBoundingClientRect();
    let playerCoords = player.getBoundingClientRect();
    
    let mobLeft = mobCoords.left;
    let mobTop = mobCoords.top;
    let mobRight = mobLeft + mobCoords.width;
    let mobBot = mobTop + mobCoords.height;

    let playerLeft = playerCoords.left;
    let playerTop = playerCoords.top; 
    let playerRight = playerLeft + playerCoords.width;
    let playerBot = playerTop + playerCoords.height;
    
    if (mobBot >= playerTop && mobTop <= playerBot && mobRight >= playerLeft && mobLeft <= playerRight) // collision
        return true;
    
    return false;
}

function run() {
    playerPos.x += playerVel.x;
    playerPos.y += playerVel.y;

    player.style.left = playerPos.x + "px";
    player.style.top = playerPos.y + "px";

    for (let i=0; i<slimes.length; ++i) { // checking if player is colliding with any slimes
        if (checkCollision(slimes[i])) {
            slimes[i].style.visibility = "visible";
            transitionAnimation(); // transition from wilderness to battle screen
        }
    }
    requestAnimationFrame(run); // will constantly call run() even when another function is running
}

function transitionAnimation() { // slowly blurs screen and switches from wilderness to battle screen
    requestAnimationFrame(userStopped); // stops user from moving during transition
    setTimeout(battleScreen, 1000); // after 1s delay battleScreen() will be called, switching from wilderness to battle screen
    land.style.animation = "blur 1s linear"; // during the 1s delay doing the blur animation
}

function battleScreen() { // function is called when player encounters a mob, switches from wilderness to battle screen
    wildernessContainer.style.display = "none"; // everything on screen will disappear (such as wilderness, exit btn, text)
    battleContainer.style.display = "block"; // go to battle screen
}

function createBushes() { // randomizes location of bushes
    for (let i=0; i<NUM_BUSHES; ++i) { 
        const bushDiv = document.createElement("bushDiv"); // creating element 
        bushDiv.id = "bush"; // giving element the bush id

        // Math.random() gives number from 0 to < 1
        bushDiv.style.left = Math.random() * 95 + "%"; // random distance from left and top of screen 
        bushDiv.style.top = Math.random() * 93 + "%";
        land.appendChild(bushDiv);
    }
}

function randomSlimeSpawn() { // basically same as createBushes()
    for (let i=0; i<NUM_SLIMES; ++i) {
        const slimeDiv = document.createElement("slimeDiv");
        slimeDiv.id = "wildSlime";
        let x = Math.random() * 95 + "%";
        let y = Math.random() * 90 + "%";
        slimeDiv.style.left = x;
        slimeDiv.style.top = y;
        land.appendChild(slimeDiv);

        slimes.push(slimeDiv); // slimes will be array of slime elements
    }
}

function userMovement(e) {
    let validKey = true; 
    let playerCoords = player.getBoundingClientRect();

    switch (e.key) {
        case 'w':
            if (playerCoords.top <= landCoords.top) // stop player if they hit border
                playerVel.y = 0;
            else
                playerVel.y = PLAYER_SPEED * -1;

            player.style.backgroundImage = "url('./img/wilderness/player_front.png')";
            break;

        case 'a':
            if (playerCoords.left <= landCoords.left) 
                playerVel.x = 0;
            else 
                playerVel.x = PLAYER_SPEED * -1;
            
            player.style.backgroundImage = "url('./img/wilderness/player_left.png')";
            break;

        case 's':
            if (playerCoords.top + playerCoords.height >= landCoords.bottom) 
                playerVel.y = 0;
            else 
                playerVel.y = PLAYER_SPEED; 
            
            player.style.backgroundImage = "url('./img/wilderness/player_back.png')";
            break;

        case 'd':
            if (playerCoords.left + playerCoords.width > landCoords.right) 
                playerVel.x = 0;
            else 
                playerVel.x = PLAYER_SPEED; 
            
            player.style.backgroundImage = "url('./img/wilderness/player_right.png')";
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
    createBushes(); // random bush locations
    run(); // player running
    randomSlimeSpawn();

    exitBtn.onclick = gameMenu;

    if (haveBoots) // if user bought speed boots, increase player speed from 1 to 3
        PLAYER_SPEED = 3;
}

init();
