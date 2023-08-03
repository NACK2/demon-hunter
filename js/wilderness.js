const NUM_BUSHES = 15;
const NUM_SLIMES = 7;

let slimeSpawningDone = false; // flag to show when all slimes have been spawned

const player = new Player();

const exitBtn = document.querySelector("#exitBtn");
const land = document.querySelector("#land");
const text = document.querySelector("#text");
const wildernessContainer = document.querySelector("#wildernessContainer"); // Container w/ everything on wilderness page
const battleContainer = document.querySelector("#battleContainer");

let bushes = []; // array of bush elements
let slimes = []; // array of slime elements
let landCoords = land.getBoundingClientRect(); // # of pixels land is from (0, 0) of the window

function gameMenu() {
    window.location = "menu.html";
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

function userRun() {
    player.updatePos(); // updates player's x and y positions with the velocity 
    player.getElement().style.left = player.getPos().x + "px";
    player.getElement().style.top = player.getPos().y + "px";
    let reqAnim = requestAnimationFrame(userRun); // will constantly call userRun() (even when another function is running)

    for (let i=0; i<slimes.length; ++i) { // checking if player is colliding with any slimes
        if (checkCollision(slimes[i], player.getElement())) {
            text.innerText = "Slime Encountered!";
            slimes[i].style.visibility = "visible";
            cancelAnimationFrame(reqAnim); // will stop constantly calling userRun() bc don't need it anymore
            transitionAnimation(); // transition from wilderness to battle screen
            battleSlime();
        }
    }
}

function transitionAnimation() { // slowly blurs screen and switches from wilderness to battle screen
    setTimeout(battleScreen, 1000); // after 1s delay battleScreen() will be called, switching from wilderness to battle screen
    land.style.animation = "blur 1s linear"; // during the 1s delay doing the blur animation
}

function battleScreen() { // function is called when player encounters a mob, switches from wilderness to battle screen
    wildernessContainer.style.display = "none"; // everything on screen will disappear (such as wilderness, exit btn, text)
    battleContainer.style.display = "block"; // go to battle screen
}

function battleSlime() {
    let slime = new Slime();
    // console.log("TEST");
    // while (slime.getHealth() > 0) {

    // }
}

function getRandomCoords(entity) {
    let x = Math.random() * 95 + "%"; // Math.random() gives number from 0 to < 1
    let y = Math.random() * 90 + "%";
    entity.style.left = x;
    entity.style.top = y;

    return entity;
}

function randomBushSpawn() { // randomizes location of bushes
    for (let i=0; i<NUM_BUSHES; ++i) { 
        let bushElement = document.createElement("bush"); // creating element 
        bushElement.id = "bush"; // giving element the bush id
        bushElement = getRandomCoords(bushElement); // gives bush random coords
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

function randomSlimeSpawn() { // basically same as randomBushSpawn()
    for (let i=0; i<NUM_SLIMES; ++i) {
        let slime = new Slime();
        let slimeElement = slime.getElement();

        slimeElement = getRandomCoords(slimeElement);
        land.appendChild(slimeElement);

        // checking if curr slime collides w ANY previously spawned slime, if so re-randomize coords for curr slime 
        for (let j=0; j<slimes.length; ++j) {
            while (checkCollision(slimes[j], slimeElement)) {
                land.removeChild(slimeElement);
                slimeElement = getRandomCoords(slimeElement);
            }
            land.appendChild(slimeElement);
        }

        // checking if curr slime collides with player (this would be bad because all mobs are spawned before
        // player can even move, meaning that player would collide with slime even tho player hasn't even moved yet,
        // we want the player to have to MOVE around to encounter a mob, not encounter it as soon as spawning in)
        while (checkCollision(slimeElement, player.getElement())) {
            land.removeChild(slimeElement);
            slimeElement = getRandomCoords(slimeElement);
        }
        land.appendChild(slimeElement);

        slimes.push(slimeElement); // slimes will be array of slime instances
    }

    slimeSpawningDone = true;
}

function userMovement(e) {
    let validKey = true; 
    let playerCoords = player.getElement().getBoundingClientRect();
    let PLAYER_SPEED = player.getSpeed();

    switch (e.key) {
        case 'w':
            if (playerCoords.top <= landCoords.top) // stop player if they hit border
                player.getVelY(0);
            else
                player.getVelY(PLAYER_SPEED * -1);
                
            player.getElement().style.backgroundImage = "url('./img/wilderness/player_front.png')";
            break;

        case 'a':
            if (playerCoords.left <= landCoords.left) 
                player.getVelX(0);
            else 
                player.getVelX(PLAYER_SPEED * -1);
            
            player.getElement().style.backgroundImage = "url('./img/wilderness/player_left.png')";
            break;

        case 's':
            if (playerCoords.top + playerCoords.height >= landCoords.bottom) 
                player.getVelY(0);
            else 
                player.getVelY(PLAYER_SPEED);
            
            player.getElement().style.backgroundImage = "url('./img/wilderness/player_back.png')";
            break;

        case 'd':
            if (playerCoords.left + playerCoords.width > landCoords.right) 
                player.getVelX(0);
            else 
                player.getVelX(PLAYER_SPEED);
            
            player.getElement().style.backgroundImage = "url('./img/wilderness/player_right.png')";
            break;

        default:
            validKey = false;
            break;
    }

    // since userMovement() is called when ANY key is pressed, making sure running animation only plays for WASD
    if (validKey) { 
        player.getElement().classList.add("running"); 
    }
}

function userStopped(e) {
    player.getVelX(0);
    player.getVelY(0);
    player.getElement().classList.remove("running"); // running animation stops when key released
}

function init() {
    randomBushSpawn(); 
    randomSlimeSpawn();
    while (!slimeSpawningDone); // waiting loop: waiting for all slimes to be spawned before player can move around
    userRun(); // player running

    exitBtn.onclick = gameMenu;

    if (haveBoots) // if user bought speed boots, set player speed to 4
        player.setSpeed(4);
}

init();
window.addEventListener("keydown", userMovement); // when any key is pressed userMovement() will be called
window.addEventListener("keyup", userStopped); // when any key is let go userStopped() will be called

// player movement basics is inspired from "Tech2 etc"
