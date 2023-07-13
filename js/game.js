let health = 70;
let gold = 50;
let xp = 0;
let inventoryList = [];

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

const dialogueText = document.querySelector("#dialogueText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const xpText = document.querySelector("#xpText");
const consoleText = document.querySelector("#consoleText");
const weaponsMenu = document.querySelector("#weaponsMenu");

// init buttons
quitBtn.onclick = quit;
btn1.onclick = store;
btn2.onclick = inventory;
btn3.onclick = wilderness;

// TO-DO: 
// - make inventory a drop down menu, lists items in inventory in the dropdown options
// - create bunch of buttons for different paths: go to town, go to store, go to boss fight, go to mine, etc
// - make sure stats such as health, gold etc. save even when user quits

function quit() { // sends you back to home page
    window.location = "index.html";
}

function store() {
    dialogueText.innerText = "Welcome to the store! \n\n\
    You can gain 10 health for 10 gold!\n\
    For information on prices of weapons, click \"Buy Weapons\"!\n\
    To go back to the town, click \"Town\"!";
    
    btn1.onclick = buyHealth;
    btn2.onclick = buyWeaponsMenu;
    btn3.onclick = town;

    btn1.innerText = "Buy Health";
    btn2.innerText = "Buy Weapons";
    btn3.innerText = "Town";
}

function inventory() {
    // TO-DO
    dialogueText.innerText = "Inventory not implemented yet"
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
    }
}

function buyWeaponsMenu() {
    dialogueText.style.display = "none";
    consoleText.innerText = "You may have to scroll down for more weapons!"
    weaponsMenu.style.display = "block";
    
}

function buyWeapon(weaponToBuy) { // function is called when user clicks button to purchase a weapon
    // weaponsList is array of objects, each object is info on a weapon
    // loop through weaponsList, find the object w/ name matching weaponToBuy, 
    // and add it to inventory as long as user doesnt already have it
    for (let i = 0; i<weaponsList.length; ++i) { 
        if (weaponsList[i].name == weaponToBuy) { 
            let hasWeapon = inventoryList.includes(weaponsList[i], 0); // check if user already has weapon
            if (!weaponsList[i].unlocked) { // weapon is locked
                consoleText.innerText = "Weapon is locked! Buy all the previous weapons first!";
            }
            else if (hasWeapon) {
                consoleText.innerText = "Weapon already bought!";
            }
            else if (weaponsList[i].price > gold) { 
                consoleText.innerText = "Insufficient gold!"
            }
            else { // successful purchase
                gold -= weaponsList[i].price;
                goldText.innerText = gold + " G";
                inventoryList.push(weaponsList[i]); // add weapon to inventory
                consoleText.innerText = "Successfully bought a " + weaponToBuy + "!";
                unlockWeapon(i);
            }
        }
    }
}

// function called when weapon is purchased, will unlock the next weapon and turn background of purchased weapon green
// weaponIndex is the index of weapon object in weaponsList
function unlockWeapon(weaponIndex) {
    let weaponImg = document.querySelector(weaponsList[weaponIndex].id + "Img");

    // removing .weaponBtnLocked class from an element each time, so each time we 
    // call document.querySelector(".weaponBtnLocked") the next element will be called as it always returns 
    // the first element w the corresponding class
    let weaponBtn = document.querySelector(".weaponBtnLocked"); 

    let weaponPrice = document.querySelectorAll(".weaponPrice"); // getting array of all .weaponPrice elements

    weaponImg.style.background = "linear-gradient(0deg, rgba(10,96,9,1) 0%, rgba(24,222,14,1) 100%)"; // make background green
    weaponPrice[weaponIndex].style.opacity = "100%"; // price is unlocked

    // conditional is weaponIndex != weaponsList.length-1 bc we are accessing next element of array, 
    // thus statement doesnt run on last element
    if (weaponIndex != weaponsList.length-1) { 
        weaponsList[weaponIndex+1].unlocked = true; // unlocking the next weapon now that current weapon is bought
        weaponImg = document.querySelector(weaponsList[weaponIndex+1].id + "Img");
        weaponImg.style.opacity = "100%"; // make next weapon img unlocked

        weaponBtn.classList.remove("weaponBtnLocked"); 
        weaponBtn.classList.add("weaponBtnUnlocked"); // make next weapon's button unlocked

        weaponPrice[weaponIndex+1].style.opacity = "100%"; // make next price unlocked
    }
}

function town() {
    weaponsMenu.style.display = "none";
    dialogueText.style.display = "block";
    dialogueText.innerText = "Welcome to the town! \n\n\
    Go to the store to buy health and weapons! \n\
    Go to the wilderness to fight some demons and earn gold!"

    btn1.onclick = store;
    btn2.onclick = inventory;
    btn3.onclick = wilderness;

    btn1.innerText = "Store";
    btn2.innerText = "Inventory";
    btn3.innerText = "Wilderness";
}