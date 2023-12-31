class Player {
    // # means private field/class
    #playerElement; 
    #playerPos;
    #playerVel;
    #health;
    #gold;
    #xp;
    #equippedWeapon; // user's currently equipped weapon, not all weapons
    #PLAYER_SPEED;
    #haveBoots

    constructor() {
        this.#playerElement = document.querySelector("#player");
        this.#PLAYER_SPEED = 2; // default speed w/o speed boots
        this.#haveBoots = JSON.parse(localStorage.getItem("boots")); // checking if player bought speed boots 

        if (localStorage.getItem("equippedWeapon") == null) // returns null if user hasn't bought any weapons
            this.#equippedWeapon = { // fists is default starter weapon
            name: "fists",
            id: "#fists",
            price: 0,
            power: 5,
            unlocked: true
        };
        else 
            this.#equippedWeapon = JSON.parse(localStorage.getItem("equippedWeapon"));

        if (localStorage.getItem("health") == null) // returns null if user hasn't bought extra health yet
            this.#health = 50; // default health
        else
            this.#health = parseInt(localStorage.getItem("health"));

        if (localStorage.getItem("gold") == null) 
            this.#gold = 30;
        else 
            this.#gold = parseInt(localStorage.getItem("gold"));

        if (localStorage.getItem("xp") == null) 
            this.#xp = 0;
        else 
            this.#xp = parseInt(localStorage.getItem("xp"));    

        this.#playerPos = { // players coordinates 
            x: parseInt(this.#playerElement.getBoundingClientRect().left),
            y: parseInt(this.#playerElement.getBoundingClientRect().top)
        };

        this.#playerVel = { // this is what will be used to move player
            x: 0, // - is left, + is right
            y: 0 // - is up, + is down
        };
    }

    setVelX(x) { // didnt create a setPlayerVel() that sets both x and y bc we are always updating only one at a time 
        this.#playerVel.x = x;
    }

    setVelY(y) {
        this.#playerVel.y = y;
    }

    getVel() { 
        return this.#playerVel; // remember, this returns object
    }

    setPos(x, y) {
        this.#playerPos.x = x;
        this.#playerPos.y = y;
    }

    updatePos() {
        this.#playerPos.x += this.#playerVel.x;
        this.#playerPos.y += this.#playerVel.y;
    }

    getPos() {
        return this.#playerPos; // remember, this returns object
    }

    setSpeed(speed) {
        this.#PLAYER_SPEED = speed;
    }

    getSpeed() {
        return this.#PLAYER_SPEED;
    }

    getElement() {
        return this.#playerElement;
    }

    setWeapon(weapon) {
        this.#equippedWeapon = weapon;
    }

    getWeapon() {
        return equippedWeapon;
    }

    getHealth() {
        return this.#health;
    }

    // will be called by mobs when they attack the player
    // decreases player health, updates and saves new health, plays either death or player getting hit animation
    decHealth(mobAttackDmg) {
        this.#health -= mobAttackDmg;

        if (this.#health < 0) { // if health dipped into negatives set it to 0
            this.#health = 0;
        }
        healthText.innerText = this.#health + " HP"; 
        healthText.classList.add("healthFlash"); // health text will flash red and have enlargening effect 
        healthText.onanimationend = (event) => {
            event.stopPropagation(); 
            healthText.classList.remove("healthFlash");
        }
        localStorage.setItem("health", JSON.stringify(this.#health)); 

        // if player dies: player death animation, else: player getting hit animation
        if (this.#health <= 0) 
            this.playerDeath();
        else 
            this.playerHit(); // animation screen makes when player is hit by mob
    }

    getGold() {
        return this.#gold;
    }

    decXp(xp) {
        this.#xp -= xp;
    }

    getXp() {
        return this.#xp;
    }

    getHaveBoots() {
        return this.#haveBoots;
    }

    basicAttack() { 
        // currMob is set to the mob that the player is curr fighting 
        // must make sure another battle screen animation (such as attack anim) isnt in progress
        if (!isBattleAnimInProgress()) { 
            currMob.decHealth(this.#equippedWeapon.power); // currMob's health decreases from being attacked

            let basicAttack = document.createElement("div");
            basicAttack.id = "basicAttack";
            currMob.getElement().appendChild(basicAttack); // making basicAttack animation a child of currMob 
    
            // after attack animation is done, remove the attack animation from the currMob
            basicAttack.onanimationend = (event) => { // () => is shorthand for function()
                currMob.getElement().removeChild(basicAttack);

                // https://stackoverflow.com/questions/71015850/how-to-stop-a-parents-onanimationend-from-running-when-a-child-run-an-animation
                // "adding the stopPropagation on the child should stop the parent from triggering their event when the child finishes"
                // since basicAttack is a child of basicAttackHit, we don't want basicAttack to trigger basicAttackHit's onanimationend
                event.stopPropagation();
            }

            currMob.getElement().classList.add("basicAttackHit"); // animation mob makes when getting hit

            // after mob getting hit aniamtion is done, remove the animation
            currMob.getElement().onanimationend = () => {
                currMob.getElement().classList.remove("basicAttackHit");
                
                // if mob dies, do death animation after player attack animations are finished, if not, mob attacks
                if (currMob.getHealth() <= 0) 
                    this.mobDeath();
                else 
                    currMob.attack();
            };
       }
    }

    chargedAttack() {
        // cost of charged attack is 10 xp
        if (!isBattleAnimInProgress() && this.#xp >= 10) {
            this.#xp -= 10; // remove xp
            xpText.innerText = this.#xp + " XP"; // update xp text
            localStorage.setItem("xp", JSON.stringify(this.#xp)); // save xp

            currMob.decHealth(this.#equippedWeapon.power * 1.2);

            let chargedAttack = document.createElement("div");
            chargedAttack.id = "chargedAttack";
            currMob.getElement().appendChild(chargedAttack); 
            chargedAttack.onanimationend = (event) => {
                currMob.getElement().removeChild(chargedAttack);
                event.stopPropagation();
            }

            currMob.getElement().classList.add("chargedAttackHit");
            currMob.getElement().onanimationend = () => {
                currMob.getElement().classList.remove("chargedAttackHit");

                if (currMob.getHealth() <= 0) 
                    this.mobDeath();
                else 
                    currMob.attack();
            };
        }
    }

    ultimateAttack() { 
        // cost of ult attack is 20 xp
        if (!isBattleAnimInProgress() && this.#xp >= 20) { 
            this.#xp -= 20;
            xpText.innerText = this.#xp + " XP"; 
            localStorage.setItem("xp", JSON.stringify(this.#xp)); 

            currMob.decHealth(this.#equippedWeapon.power * 1.5);
            
            let ultimateAttack = document.createElement("div");
            ultimateAttack.id = "ultimateAttack";
            currMob.getElement().appendChild(ultimateAttack); 
            ultimateAttack.onanimationend = (event) => {
                currMob.getElement().removeChild(ultimateAttack);
                event.stopPropagation();
            }

            currMob.getElement().classList.add("ultimateAttackHit");
            currMob.getElement().onanimationend = () => { 
                currMob.getElement().classList.remove("ultimateAttackHit");

                if (currMob.getHealth() <= 0) 
                    this.mobDeath();
                else 
                    currMob.attack();
            };
        }
    }

    // called when mob dies, gives player gold and xp, plays death animation, and goes back to wilderness screen
    mobDeath() {
        this.#gold += currMob.dropGold(); // player gains the gold that mob dropped after mob was killed
        goldText.innerText = this.#gold + " G"; // update battle screen gold text
        localStorage.setItem("gold", JSON.stringify(this.#gold)); // save data

        this.#xp += currMob.dropXp();
        xpText.innerText = this.#xp + " XP"; 
        localStorage.setItem("xp", JSON.stringify(this.#xp)); 

        currMob.getElement().classList.add("mobDeath"); 

        // after death animation is done, remove animation and go back to wilderness screen
        currMob.getElement().onanimationend = () => {
            currMob.getElement().classList.remove("mobDeath")
            wildernessScreen();
        }

        unbindBattleBtns(); // unbinds the battle screen buttons
    }    

    // called when player dies, restores health to default, saves health and sends player back to wilderness
    playerDeath() {
        this.#health = 50; // restore to default health
        localStorage.setItem("health", JSON.stringify(this.#health)); 
        localStorage.setItem("xp", JSON.stringify(this.#xp)); 

        battleContainer.classList.add("playerDeath"); 
        battleContainer.onanimationend = () => {
            battleContainer.classList.remove("playerDeath")
            wildernessScreen();

            // updating health text on animation end so that player won't see the restored default health during
            // the dying animation, that way they can see the 0 HP during player death animation, and will be updated to
            // default health for next time
            healthText.innerText = this.#health + " HP"; 
        }
    }

    // called when player gets hit by mob, flash grayscale screen
    playerHit() {
        battleBackground.classList.add("playerHit");
        battleBackground.onanimationend = () => {
            battleBackground.classList.remove("playerHit");
        }
    }
}