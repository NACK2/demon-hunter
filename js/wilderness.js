import haveBoots from '../js/game.js'; // getting haveBoots variable from game.js
// console.log(JSON.parse(haveBoots));

const NUM_BUSHES = 15;
const NUM_SLIMES = 7;
let PLAYER_SPEED = 1; // will be set to 3 if haveBoots is true

const exitBtn = document.querySelector("#exitBtn");
const land = document.querySelector("#land");
const player = document.querySelector("#player");
const text = document.querySelector("#text");
const wildernessContainer = document.querySelector("#wildernessContainer"); // Container w/ everything on wilderness page
const battleContainer = document.querySelector("#battleContainer");

let bushes = []; // array of bush elements
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

function checkCollision(entity1, entity2) { // returns true if entity1 and entity2 are colliding
    let entityCoords1 = entity1.getBoundingClientRect();
    let entityCoords2 = entity2.getBoundingClientRect();
    
    let entityLeft1 = entityCoords1.left;
    let entityTop1 = entityCoords1.top;
    let entityRight1 = entityLeft1 + entityCoords1.width;
    let entityBot1 = entityTop1 + entityCoords1.height;

    let entityLeft2 = entityCoords2.left;
    let entityTop2 = entityCoords2.top; 
    let entityRight2 = entityLeft2 + entityCoords2.width;
    let entityBot2 = entityTop2 + entityCoords2.height;
    
    if (entityBot1 >= entityTop2 && entityTop1 <= entityBot2 && entityRight1 >= entityLeft2 && entityLeft1 <= entityRight2) // collision
        return true;
    
    return false;
}

function run() {
    playerPos.x += playerVel.x;
    playerPos.y += playerVel.y;

    player.style.left = playerPos.x + "px";
    player.style.top = playerPos.y + "px";

    for (let i=0; i<slimes.length; ++i) { // checking if player is colliding with any slimes
        if (checkCollision(slimes[i], player)) {
            text.innerText = "Slime Encountered!";
            slimes[i].style.visibility = "visible";
            transitionAnimation(); // transition from wilderness to battle screen
        }
    }
    requestAnimationFrame(run); // will constantly call run() even when another function is running
}

function transitionAnimation() { // slowly blurs screen and switches from wilderness to battle screen
    requestAnimationFrame(userStopped); // stops user from moving during transition
    setTimeout(battleScreen, 1000); // after 1s delay battleScreen() will be called, switching from wilderness to battle screen
    land.style.animation = "blur 2s linear"; // during the 1s delay doing the blur animation
}

function battleScreen() { // function is called when player encounters a mob, switches from wilderness to battle screen
    wildernessContainer.style.display = "none"; // everything on screen will disappear (such as wilderness, exit btn, text)
    battleContainer.style.display = "block"; // go to battle screen
}

function createBushes() { // randomizes location of bushes
    for (let i=0; i<NUM_BUSHES; ++i) { 
        let bushElement = document.createElement("bush"); // creating element 
        bushElement.id = "bush"; // giving element the bush id

        // Math.random() gives number from 0 to < 1
        bushElement.style.left = Math.random() * 95 + "%"; // random distance from left and top of screen 
        bushElement.style.top = Math.random() * 93 + "%";
        land.appendChild(bushElement);

        // Bush Collision Checking: 
        // if curr bush collides w/ previously spawned bushes, remove the curr bush from wilderness and 
        // get it new coords, once coords that doesnt collide is found, add the bush to wilderness
        for (let j=0; j<bushes.length; ++j) {
            while (checkCollision(bushes[j], bushElement)) {
                land.removeChild(bushElement);
                bushElement = getRandomCoords(bushElement);
            }
            land.appendChild(bushElement);
        }

        bushes.push(bushElement);
    }
}

function getRandomCoords(entity) {
    let x = Math.random() * 95 + "%";
    let y = Math.random() * 90 + "%";
    entity.style.left = x;
    entity.style.top = y;

    return entity;
}

function randomSlimeSpawn() { // basically same as createBushes()
    for (let i=0; i<NUM_SLIMES; ++i) {
        let slimeElement = document.createElement("slimeDiv");
        slimeElement.id = "wildSlime";
        slimeElement.style.left = Math.random() * 95 + "%";
        slimeElement.style.top = Math.random() * 90 + "%";
        land.appendChild(slimeElement);

        for (let j=0; j<slimes.length; ++j) {
            while (checkCollision(slimes[j], slimeElement)) {
                land.removeChild(slimeElement);
                slimeElement = getRandomCoords(slimeElement);
            }
            land.appendChild(slimeElement);
        }

        slimes.push(slimeElement); // slimes will be array of slime elements
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
