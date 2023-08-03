let haveBoots = false; // flag for if user bought speed boots
let inventoryList = []; // inventoryList only consists of weapons, doesnt include speed boots
let health = 70;
let gold = 50;
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

haveBoots = JSON.parse(localStorage.getItem("boots"));
const quitBtn = document.querySelector("#quitBtn");
const btn1 = document.querySelector("#btn1");
const btn2 = document.querySelector("#btn2");
const btn3 = document.querySelector("#btn3");
const bootsBtn = document.querySelector("#bootsBtn");

const dialogueText = document.querySelector("#dialogueText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const xpText = document.querySelector("#xpText");
const consoleText = document.querySelector("#consoleText");
const itemMenu = document.querySelector(".itemMenu");
const bootsImg = document.querySelector("#bootsImg");

// (could've chose any element but chose quitBtn by random) if quitBtn == null means menu.js has been opened from
// wilderness.html, and since menu.js accesses elements of menu.html, those elements will be null as
// wilderness.html doesn't have access to those elements, therefore dont call init() if quitBtn is null bc 
//that means this file was ran from wilderness.html and we don't need to init anything
if (quitBtn != null) {
    init();
}

function init() { // initialization
    // init buttons
    quitBtn.onclick = quit;
    btn1.onclick = store;
    btn2.onclick = inventory;
    btn3.onclick = wilderness;
    bootsBtn.onclick = buyBoots;
    bindWeaponBtns();

    // getting any previously saved data such as inventory, gold, health, etc and loading them
    let savedHealth = localStorage.getItem("health"); // returns null if data key does not exist
    let savedGold = localStorage.getItem("gold");
    let savedXp = localStorage.getItem("xp");
    let savedInventory = localStorage.getItem("inventory"); // remember, savedInventory only has weapons, no boots
    let savedBoots = localStorage.getItem("boots");

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

        // if savedInventory != null, means user bought items on previous run, so must link all the new unlocked weapon btns 
        // with buyWeapon() by calling bindWeaponBtns()
        bindWeaponBtns(); 
    }
    if (savedBoots != null) {
        haveBoots = true;
        bootsImg.style.background = "linear-gradient(0deg, rgba(10,96,9,1) 0%, rgba(24,222,14,1) 100%)"; // make background green
    }
}

// adds event listener to each buying weapon button with buyWeapon() 
// every time weapon is bought, unlockWeapon() is called and the number of elements with
// .itemBtnUnlocked increases by 1 each time, so have to do querySelectorAll(".itemBtnUnlocked") and relink each
// button with buyWeapon() PLUS the new .itemBtnUnlocked element with buyWeapon()
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

function inventory() {
    dialogueText.innerText = "INVENTORY WILL LOOK BETTER, THIS IS TEMPORARY\n\n";

    if (!inventoryList.length && !haveBoots) {
        alert("Empty Inventory :(");
    }
    else {
        if (inventoryList.length > 0) { // NOTE: inventoryList ONLY includes weapons, not speed boots
            for (let i=0; i<inventoryList.length; ++i) {
                dialogueText.innerText += "- " + inventoryList[i].name + '\n';
            }
        }

        if (haveBoots) {
            dialogueText.innerText += "- speed boots" + '\n';
        }
    }
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

function buyWeapon() { // function is called when user clicks button to purchase a weapon

    // the function (buyWeapon()) used for addEventListener will automatically have "this" bound to 
    // the current btn element used as the event in the event listener
    let weaponId = '#' + this.id; 
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
                inventoryList.push(weaponsList[i]); // add weapon to inventory
                consoleText.innerText = "Successfully bought a " + weaponsList[i].name + "!";
                localStorage.setItem("gold", JSON.stringify(gold)); // saving gold data
                localStorage.setItem("inventory", JSON.stringify(inventoryList)); // saving inventory data
                unlockWeapon(i); // unlocking weapon turns the weapon background from gray to green in weapon buy menu
            }
        }
    }
}

// function called when weapon is purchased, will unlock the next weapon and turn background of purchased weapon green
// weaponIndex is the index of weapon object in weaponsList
function unlockWeapon(weaponIndex) {
    let weaponImg = document.querySelector(weaponsList[weaponIndex].id + "Img");

    // removing .itemBtnLocked class from an element each time, so each time we 
    // call document.querySelector(".itemBtnLocked") the next element will be called as it always returns 
    // the first element w the corresponding class
    let weaponBtn = document.querySelector(".itemBtnLocked"); 

    let weaponPrice = document.querySelectorAll(".itemPrice"); // getting array of all .weaponPrice elements

    weaponImg.style.background = "linear-gradient(0deg, rgba(10,96,9,1) 0%, rgba(24,222,14,1) 100%)"; // make background green
    weaponPrice[weaponIndex].style.opacity = "100%"; // price is unlocked

    // conditional is weaponIndex != weaponsList.length-1 bc we are accessing next element of array, 
    // thus statement doesnt run on last element
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