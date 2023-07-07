let health = 100;
let gold = 70;
let xp = 0;
let inventory = [];

let weapons = [
    {
        // btn click for buying weapon will send a paremeter matching these names
        name: "slingshot",
        price: 10,
        power: 5
    },
    {
        name: "baseballBat",
        price: 30,
        power: 10
    },
    {
        name: "woodSword",
        price: 60,
        power: 30
    },
    {
        name: "stoneSword",
        price: 90,
        power: 50
    },
    {
        name: "dualWield",
        price: 150,
        power: 80
    }
];

const quitBtn = document.querySelector("#quitBtn");
const btn1 = document.querySelector("#btn1");
const btn2 = document.querySelector("#btn2");
const btn3 = document.querySelector("#btn3");

const dialogueText = document.querySelector("#dialogueText");
const healthTxt = document.querySelector("#healthText");
const goldTxt = document.querySelector("#goldText");
const xpTxt = document.querySelector("#xpText");
const consoleTxt = document.querySelector("#consoleText");
const weaponsMenu = document.querySelector("#weaponsMenu");

// init buttons
quitBtn.onclick = quit;
btn1.onclick = store;
btn2.onclick = cave;
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

function cave() {
    // TO-DO
    dialogueText.innerText = "Not implemented yet"
}

function wilderness() {
    // TO-DO
    dialogueText.innerText = "Not implemented yet"
}

function buyHealth() {
    weaponsMenu.style.display = "none";
    dialogueText.style.display = "block";
    if (gold < 10) {
        dialogueText.innerText = "Insufficient gold!";
    }
    else {
        health += 10;
        gold -= 10;

        dialogueText.innerText = "Successfully gained 10 health!";
        healthText.innerText = health;
        goldText.innerText = gold;
    }
}

function buyWeaponsMenu() {
    dialogueText.innerText = "You may scroll down for more weapons!"
    weaponsMenu.style.display = "block";
}

function buyWeapon(weapon) {
    // look for weapon object matching the weapon paremeter, add it to inventory
    for (let i = 0; i<weapons.length; ++i) { 
        if (weapons[i].name == weapon) {
            inventory.push(weapons[i]);
            console.log(inventory);
        }
    }
}

function town() {
    weaponsMenu.style.display = "none";
    dialogueText.style.display = "block";
    dialogueText.innerText = "Welcome to the town! \n\n\
    Go to the store to buy health and weapons! \n\
    Go to the cave to look for materials and gold to help you on your journey! \n\
    Go to the wilderness to fight some demons and earn gold!"

    btn1.onclick = store;
    btn2.onclick = cave;
    btn3.onclick = wilderness;

    btn1.innerText = "Store";
    btn2.innerText = "Cave";
    btn3.innerText = "Wilderness";
}