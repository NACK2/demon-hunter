const NUM_BUSHES = 15;
const NUM_SLIMES = 7;

let slimeSpawningDone = false; // flag to show when all slimes have been spawned
let currMob; // is current mob that player is fighting

const player = new Player();

const exitBtn = document.querySelector("#exitBtn");
const runBtn = document.querySelector("#runBtn");
const basicAttackBtn = document.querySelector("#basicAttackBtn");
const chargedAttackBtn = document.querySelector("#chargedAttackBtn");
const ultimateAttackBtn = document.querySelector("#ultimateAttackBtn");

const land = document.querySelector("#land");
const text = document.querySelector("#text");
const wildernessContainer = document.querySelector("#wildernessContainer"); // Container w/ everything on wilderness page
const battleContainer = document.querySelector("#battleContainer");
const battleBackground = document.querySelector("#battleBackground");

let bushes = []; // array of bush elements
let slimes = []; // array of slime elements
let landCoords = land.getBoundingClientRect(); // # of pixels land is from (0, 0) of the window

function init() {
    spawnEntities(); // spawns mobs and init's player running
    exitBtn.onclick = gameMenu;

    healthText.innerText = player.getHealth() + " HP";
    goldText.innerText = player.getGold() + " G";
    xpText.innerText = player.getXp() + " XP";

    if (player.getHaveBoots()) // if user bought speed boots, set player speed to 4
        player.setSpeed(4);
}

// this function will spawn all entities and init player running abilities, function is called upon init or 
// when player is returning from the battle screen 
function spawnEntities() {
    // altho default value of slimeSpawningDone is already false, could have been set 
    // to true on a previous call to randomSlimeSpawn();
    slimeSpawningDone = false; 

    randomBushSpawn(); 
    randomSlimeSpawn(); // slimeSpawningDone will be set true at the end of randomSlimeSpawn()
    while (!slimeSpawningDone); // polling loop: waiting for all slimes to be spawned before player can move around
    userRun(); // init player running abilities
}

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

// this function is constantly being called to updates user's coords when running, and checks if user is colliding
// with any mobs 
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

// slowly blurs screen and switches from wilderness to battle screen
function transitionAnimation() { 
    land.classList.add("blur"); // blur effect
    land.onanimationend = () => {
        land.classList.remove("blur");
        battleScreen();
    }
}

// function is called when player encounters a mob, switches from wilderness to battle screen
function battleScreen() { 
    wildernessContainer.style.display = "none"; // everything on screen will disappear (such as wilderness, exit btn, text)
    battleContainer.style.display = "block"; // go to battle screen

    battleContainer.classList.add("unblur"); // unblur battle screen 
    battleContainer.onanimationend = () => {
        battleContainer.classList.remove("unblur");
    }
}

// function is called when player is running away from battle encounter with mob
function wildernessScreen() {
    battleContainer.style.display = "none"; 
    wildernessContainer.style.display = "block";

    // removing old bushes and slimes and spawning new ones 
    for (let i=0; i<NUM_BUSHES; ++i) {
        land.removeChild(bushes[i]);
    }
    for (let i=0; i<NUM_SLIMES; ++i) {
        land.removeChild(slimes[i]);
    }

    bushes = []; // emptying arrays
    slimes = [];
  
    spawnEntities(); // respawn new locations for mobs
}

// will be called when a button on the battle screen is trying to be clicked
// if the # of children and classes is 0, means no battle screen animation (such as attack animations) is 
// in progress, if any is > 0 means another animation is in progress
function isBattleAnimInProgress() {
    // currMob's child has player's attack anim, currMob has mob getting hit by attack anim, battleBackground has player getting hit by mob anim
    if (!currMob.getElement().childNodes.length && !currMob.getElement().classList.length && !battleBackground.classList.length)
        return false;
    
    return true;
}

// binds each button on the battle screen
function initBattleBtns() {
    basicAttackBtn.addEventListener("click", basicAttackEventHandler);
    chargedAttackBtn.addEventListener("click", chargedAttackEventHandler);
    ultimateAttackBtn.addEventListener("click", ultimateAttackEventHandler);
    runBtn.addEventListener("click", runBtnEventHandler);
}

function basicAttackEventHandler(e) {
    player.basicAttack();
}

function chargedAttackEventHandler(e) {
    player.chargedAttack();
}

function ultimateAttackEventHandler(e) {
    player.ultimateAttack();
}

function runBtnEventHandler(e) {
    // if another battle screen animation (such as attack animation) isnt in progress, its ok to run back to wilderness
    if (!isBattleAnimInProgress()) 
        wildernessScreen();
}

// unbinds each button on the battle screen
function unbindBattleBtns() {
    basicAttackBtn.removeEventListener("click", basicAttackEventHandler);
    chargedAttackBtn.removeEventListener("click", chargedAttackEventHandler);
    ultimateAttackBtn.removeEventListener("click", ultimateAttackEventHandler);
    runBtn.removeEventListener("click", runBtnEventHandler);
    // currMob = null;
}

function battleSlime() { // fight with slime
    let slime = new Slime(); 
    currMob = slime; // sets current mob player is fighting
    initBattleBtns();
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
        let bushElement = document.createElement("div"); // creating element 
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
        let slimeElement = document.createElement("div");
        slimeElement.id = "wildSlime";
        slimeElement = getRandomCoords(slimeElement);
        land.appendChild(slimeElement);

        // checking if curr slime collides player or any previously spawned slime, if so re-randomize coords for curr slime,
        // while loop will go until no entities are colliding 
        for (let j=0; j<slimes.length; ++j) {
            while (checkCollision(slimeElement, slimes[j]) || checkCollision(slimeElement, player.getElement())) {
                land.removeChild(slimeElement);
                slimeElement = getRandomCoords(slimeElement);
            }
            land.appendChild(slimeElement);
        }

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
                player.setVelY(0);
            else
                player.setVelY(PLAYER_SPEED * -1);
                
            player.getElement().style.backgroundImage = "url('./img/wilderness/player_front.png')";
            break;

        case 'a':
            if (playerCoords.left <= landCoords.left) 
                player.setVelX(0);
            else 
                player.setVelX(PLAYER_SPEED * -1);
            
            player.getElement().style.backgroundImage = "url('./img/wilderness/player_left.png')";
            break;

        case 's':
            if (playerCoords.top + playerCoords.height >= landCoords.bottom) 
                player.setVelY(0);
            else 
                player.setVelY(PLAYER_SPEED);
            player.getElement().style.backgroundImage = "url('./img/wilderness/player_back.png')";
            break;

        case 'd':
            if (playerCoords.left + playerCoords.width > landCoords.right) 
                player.setVelX(0);
            else 
                player.setVelX(PLAYER_SPEED);
            
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
    player.setVelX(0);
    player.setVelY(0);
    player.getElement().classList.remove("running"); // running animation stops when key released
}

init();
window.addEventListener("keydown", userMovement); // when any key is pressed userMovement() will be called
window.addEventListener("keyup", userStopped); // when any key is let go userStopped() will be called

// userMovement() userStopped() checkCollision() inspired from "Tech2 etc"
