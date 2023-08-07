let haveBoots = false; // flag for if user bought speed boots
let inventoryList = []; // inventoryList only consists of weapons, doesnt include speed boots
let equippedWeaponId = "fists"; // stores currently equipped weapon's id, the default weapon is fists
let health = 50;
let gold = 30;
let xp = 0;

let weaponsList = [
    {
        name: "slingshot",
        id: "#slingshot",
        price: 10,
        power: 5,
        // to buy a weapon you must buy every weapon weaker than that weapon first, 
        // hence you start off only being able to buy the first, so unlocked = true only for first weapon
        unlocked: true 
    },
    {
        name: "baseball bat",
        id: "#baseballBat",
        price: 30,
        power: 10, 
        unlocked: false
    },
    {
        name: "wood sword",
        id: "#woodSword",
        price: 60,
        power: 30,
        unlocked: false
    },
    {
        name: "stone sword",
        id: "#stoneSword",
        price: 90,
        power: 50,
        unlocked: false
    },
    {
        name: "dual wield sword",
        id: "#dualWieldSword",
        price: 150,
        power: 80,
        unlocked: false
    }
];

const quitBtn = document.querySelector("#quitBtn");
const btn1 = document.querySelector("#btn1");
const btn2 = document.querySelector("#btn2");
const btn3 = document.querySelector("#btn3");
const bootsBtn = document.querySelector("#bootsBtn");
const equipBtns = document.querySelectorAll(".equipBtn"); // array of all .equipBtn btn's

const dialogueText = document.querySelector("#dialogueText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const xpText = document.querySelector("#xpText");
const consoleText = document.querySelector("#consoleText");

const itemMenu = document.querySelector("#itemMenu");
const inventoryMenu = document.querySelector("#inventoryMenu");
const bootsImg = document.querySelector("#bootsImg");

// (could've chose any element but chose quitBtn by random) if quitBtn == null means menu.js has been opened from
// wilderness.html, and since menu.js accesses elements of menu.html, those elements will be null as
// wilderness.html doesn't have access to those elements, therefore dont call init() if quitBtn is null bc 
//that means this file was ran from wilderness.html and we don't need to init anything
if (quitBtn != null) {
    init();
}

function init() { // initialization
    // getting any previously saved data such as inventory, gold, health, etc and loading them
    let savedHealth = localStorage.getItem("health"); // getItem() returns null if data key does not exist
    let savedGold = localStorage.getItem("gold");
    let savedXp = localStorage.getItem("xp");
    let savedInventory = localStorage.getItem("inventory"); // remember, savedInventory only has weapons, no boots
    let savedBoots = localStorage.getItem("boots");
    let savedEquippedWeapon = localStorage.getItem("equippedWeaponId");

    if (savedHealth != null) { // check that key exists
        healthText.innerText = savedHealth + " HP";
        health = parseInt(savedHealth); // turning into int because getItem() returns string
    }
    if (savedGold != null) {
        goldText.innerText = savedGold + " G";
        gold = parseInt(savedGold);
    }
    if (savedXp != null) {
        xpText.innerText = savedXp + " XP";
        xp = parseInt(savedXp);
    }
    if (savedInventory != null) {
        inventoryList = JSON.parse(savedInventory); // JSON.parse() turns into object because getItem() returns string
        // for each of previously bought weapons, making the background green in weapon store to show it was already bought
        for (let i=0; i<inventoryList.length; ++i) {
            unlockWeapon(i); 
        }

        // if savedInventory != null, means user bought items previously, so must link all the new unlocked weapon btns 
        // with buyWeapon() by calling bindWeaponBtns()
        bindWeaponBtns(); 
    }
    if (savedBoots != null) {
        haveBoots = true;
        bootsImg.style.background = "linear-gradient(0deg, rgba(10,96,9,1) 0%, rgba(24,222,14,1) 100%)"; // make background green
    }
    if (savedEquippedWeapon != null) {
        equippedWeaponId = savedEquippedWeapon; 
    }

    // init buttons
    quitBtn.onclick = quit;
    btn1.onclick = store;
    btn2.onclick = inventory;
    btn3.onclick = wilderness;
    bootsBtn.onclick = buyBoots;
    for (let i=0; i<equipBtns.length; ++i) { // link each equip button with equipWeapon()
        equipBtns[i].addEventListener("click", equipWeapon);
    }

    bindWeaponBtns();
}

// this function is called on initilization and when a new button is unlocked
// each button with .itemBtnUnlocked class will be binded to buyWeapon(), when a weapon is bought
// is will unlock the next weapon and give the next weapon the class .itemBtnUnlocked, thus having to 
// call this function again to link the new button
function bindWeaponBtns() { 
    let weaponUnlockedBtns = document.querySelectorAll(".itemBtnUnlocked"); // weaponUnlockedBtns is array of elements
    for (let i=0; i<weaponUnlockedBtns.length; ++i) {
        weaponUnlockedBtns[i].addEventListener("click", buyWeapon);
    }
}

function quit() { // sends you back to home page
    window.location = "index.html";
}

function store() {
    inventoryMenu.style.display = "none";
    consoleText.innerText = "Made by NACK2!";
    dialogueText.innerText = "Welcome to the store! \n\n\
    You can gain 10 health for 10 gold!\n\
    For information on prices of various items, click \"Buy Items\"!\n\
    To go back to the town, click \"Town\"!";
    
    btn1.onclick = buyHealth;
    btn2.onclick = buyItemMenu;
    btn3.onclick = town;

    btn1.innerText = "Buy Health";
    btn2.innerText = "Buy Items";
    btn3.innerText = "Town";
}

// inventory screen
function inventory() {
    dialogueText.innerText = "";
    inventoryMenu.style.display = "block";
    consoleText.innerText = "Equip a weapon!"

    if (!inventoryList.length && !haveBoots) { // empty inventory
        dialogueText.innerText += "Empty Inventory :(";
    }

    for (let i=0; i<inventoryList.length; ++i) { // makes all weapons that the player bought visible in inventory
        document.querySelector(inventoryList[i].id + "Figure").style.display = "inline-block";

        if (inventoryList[i].id == equippedWeaponId) { // make equipped weapon's background green
             // make background green
            document.querySelector(equippedWeaponId + "InvImg").style.background = "linear-gradient(0deg, rgba(10,96,9,1) 0%, rgba(24,222,14,1) 100%)";
        }
        else {
            // default colour
            document.querySelector(inventoryList[i].id + "InvImg").style.background = "linear-gradient(0deg, rgba(80,78,78,1) 0%, rgba(203,201,201,1) 100%)"; 
        }
    }

    if (haveBoots) { // have to do this separately bc inventoryList doesnt include boots, only weapons
        document.querySelector("#bootsFigure").style.display = "inline-block";
        // boots are always equipped by default once youve bought them
        document.querySelector("#bootsInvImg").style.background = "linear-gradient(0deg, rgba(10,96,9,1) 0%, rgba(24,222,14,1) 100%)";
    }
}

// called when user clicks on a button to equip a weapon
function equipWeapon() {
    // "this" will be binded to the button element that was clicked because of addEventListener()
    let weaponId = '#' + this.id;
    if (weaponId != equippedWeaponId) { // equipping new weapon
        // change prev equipped weapon's background image to gray (default colour)
        document.querySelector(equippedWeaponId + "InvImg").style.background = "linear-gradient(0deg, rgba(80,78,78,1) 0%, rgba(203,201,201,1) 100%)"; 

        equippedWeaponId = weaponId; // update equipped weapon id

        // making new equipped weapon's background image to green
        document.querySelector(weaponId + "InvImg").style.background = "linear-gradient(0deg, rgba(10,96,9,1) 0%, rgba(24,222,14,1) 100%)";
        consoleText.innerText = "Weapon equipped!";
        localStorage.setItem("equippedWeaponId", equippedWeaponId); // saving equipped weapon data
    }
    else  // weapon chosen is already equipped
        consoleText.innerText = "Weapon already equipped!";
}

function wilderness() {
    window.location = "wilderness.html";
}

function buyHealth() {
    if (gold < 10) {
        consoleText.innerText = "Insufficient gold!";
    }
    else {
        health += 10;
        gold -= 10;

        consoleText.innerText = "Successfully bought 10 health!";
        healthText.innerText = health + " HP";
        goldText.innerText = gold + " G";

        // saving data, must do JSON.stringify() bc only accepts strings
        localStorage.setItem("health", JSON.stringify(health)); 
        localStorage.setItem("gold", JSON.stringify(gold)); 
    }
}

function buyItemMenu() { // item menu for buying both weapons and speed boots
    dialogueText.style.display = "none";
    consoleText.innerText = "You may have to scroll down for more weapons!"
    itemMenu.style.display = "block";
}

// function is called when user clicks button to purchase a weapon
function buyWeapon() {
    // the function (buyWeapon()) used for addEventListener will automatically have "this" bound to 
    // the current btn element used as the event in the event listener
    let weaponId = '#' + this.id; // weaponId is ID of the weapon that user is trying to buy
    for (let i = 0; i<inventoryList.length; ++i) { // check if user already bought weapon
        if (inventoryList[i].id == weaponId) {
            consoleText.innerText = "Already purchased " + inventoryList[i].name + "!";
            return;
        }
    }
    
    // weaponsList is array of all possible weapon objects, each object is info on a weapon.
    // loop through weaponsList, find the object w/ id matching weaponId and add it to inventory 
    for (let i = 0; i<weaponsList.length; ++i) { 
        if (weaponsList[i].id == weaponId) { 
            // if (!weaponsList[i].unlocked) { // weapon is locked
            //     consoleText.innerText = "Weapon is locked! Buy all the previous weapons first!";
            // }
            if (weaponsList[i].price > gold) { 
                consoleText.innerText = "Insufficient gold!"
            }
            else { // successful purchase
                gold -= weaponsList[i].price; 
                goldText.innerText = gold + " G";
                equippedWeaponId = weaponsList[i].id; // do this bc by default equips most recently bought weapon
                inventoryList.push(weaponsList[i]); // add weapon to inventory
                consoleText.innerText = "Successfully bought and equipped a " + weaponsList[i].name + "!";

                localStorage.setItem("gold", JSON.stringify(gold)); // saving gold data
                localStorage.setItem("inventory", JSON.stringify(inventoryList)); // saving inventory data
                localStorage.setItem("equippedWeaponId", equippedWeaponId); // saving equipped weapon data
                unlockWeapon(i); // unlocking weapon turns the weapon background from gray to green in weapon buy menu
            }
        }
    }
}

// function called when weapon is purchased, will unlock the next weapon and turn background of purchased weapon green
// weaponIndex is the index of weapon object in weaponsList
function unlockWeapon(weaponIndex) {
    let weaponImg = document.querySelector(weaponsList[weaponIndex].id + "Img");

    // since we are removing .itemBtnLocked class from an element each iteration, in every iteration we 
    // call document.querySelector(".itemBtnLocked") the next element will be called as it always returns 
    // the first element w the corresponding class
    let weaponBtn = document.querySelector(".itemBtnLocked"); 

    let weaponPrice = document.querySelectorAll(".itemPrice"); // getting array of all .weaponPrice elements

    weaponImg.style.background = "linear-gradient(0deg, rgba(10,96,9,1) 0%, rgba(24,222,14,1) 100%)"; // make background green
    weaponPrice[weaponIndex].style.opacity = "100%"; // price is unlocked

    // conditional is weaponIndex != weaponsList.length-1; since we are accessing next element of array, 
    // making sure statement doesnt run on last element
    if (weaponIndex != weaponsList.length-1) { 
        weaponsList[weaponIndex+1].unlocked = true; // unlocking the next weapon now that current weapon is bought
        weaponImg = document.querySelector(weaponsList[weaponIndex+1].id + "Img");
        weaponImg.style.opacity = "100%"; // make next weapon img unlocked

        weaponBtn.classList.remove("itemBtnLocked"); 
        weaponBtn.classList.add("itemBtnUnlocked"); // make next weapon's button unlocked

        weaponPrice[weaponIndex+1].style.opacity = "100%"; // make next price unlocked
    }

    bindWeaponBtns(); // since unlocking new weapon, want to make sure the new unlocked weapon gets binded to buyWeapon()
}

function buyBoots() { // note: speed boots are unlocked by default; all user has to do is buy them
    if (haveBoots) { 
        consoleText.innerText = "Already purchased speed boots!";
    }
    else if (gold < 50) {
        consoleText.innerText = "Insufficient gold!";
    }
    else { // successful purchase
        bootsImg.style.background = "linear-gradient(0deg, rgba(10,96,9,1) 0%, rgba(24,222,14,1) 100%)"; // make background green

        gold -= 50;
        goldText.innerText = gold + " G";
        localStorage.setItem("gold", JSON.stringify(gold)); // saving gold data
        consoleText.innerText = "Successfully bought speed boots!";

        haveBoots = true;
        localStorage.setItem("boots", haveBoots); // saving data that user bought boots
    }
}

function town() {
    itemMenu.style.display = "none";
    consoleText.innerText = "Made by NACK2!";
    dialogueText.style.display = "block";
    dialogueText.innerText = "Welcome to the town! \n\n\
    Go to the store to buy health and items! \n\
    Go to the wilderness to fight some demons and earn gold!"

    btn1.onclick = store;
    btn2.onclick = inventory;
    btn3.onclick = wilderness;

    btn1.innerText = "Store";
    btn2.innerText = "Inventory";
    btn3.innerText = "Wilderness";
}