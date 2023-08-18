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

    getGold() {
        return this.#gold;
    }

    getXp() {
        return this.#xp;
    }

    getHaveBoots() {
        return this.#haveBoots;
    }

    basicAttack() { 
        // currMob is set to the mob that the player is fighting 
        // must make sure the mob has 0 children, if it # of children > 0 that means another attack is in progress
        if (currMob.getElement().childNodes.length == 0) { 
            currMob.decHealth(this.#equippedWeapon.power); // currMob's health decreases from being attacked
            
            let basicAttack = document.createElement("div");
            basicAttack.id = "basicAttack";
            currMob.getElement().appendChild(basicAttack); // layering basicAttack animation on top of currMob 
            
            // after attack animation is done, remove the attack animation from the currMob
            setTimeout(function() { currMob.getElement().removeChild(basicAttack); }, 500); 

            // https://www.harrytheo.com/blog/2021/02/restart-a-css-animation-with-javascript/
            // according to that link, to restart animation have to trigger "DOM Overflow" by calling element.offsetWidth
            currMob.getElement().offsetWidth;
            currMob.getElement().classList.add("basicAttackHit"); // animation mob makes when getting hit

            // remove mob getting hit animation
            setTimeout(function() { currMob.getElement().classList.remove("basicAttackHit"); }, 500);

            // if mob dies, do death animation after player attack animations are finished
            if (currMob.getHealth() <= 0)
                setTimeout(this.mobDeath, 500); 
       }
    }

    chargedAttack() {
        if (currMob.getElement().childNodes.length == 0) {
            currMob.decHealth(this.#equippedWeapon.power * 1.2);

            let chargedAttack = document.createElement("div");
            chargedAttack.id = "chargedAttack";
            currMob.getElement().appendChild(chargedAttack); 
            setTimeout(function() {currMob.getElement().removeChild(chargedAttack); }, 1000);

            currMob.getElement().offsetWidth;
            currMob.getElement().classList.add("chargedAttackHit");
            setTimeout(function() { currMob.getElement().classList.remove("chargedAttackHit"); }, 1000);
            
            if (currMob.getHealth() <= 0)
                setTimeout(this.mobDeath, 1000);
        }
    }

    // MAYBE CREATE attack(level) function cuz ultimate and basic  attacks are basically exact same funciton
    ultimateAttack() { 
        if (currMob.getElement().childNodes.length == 0) { 
            currMob.decHealth(this.#equippedWeapon.power * 1.5);
            
            let ultimateAttack = document.createElement("div");
            ultimateAttack.id = "ultimateAttack";
            currMob.getElement().appendChild(ultimateAttack); 
            setTimeout(function() { currMob.getElement().removeChild(ultimateAttack); }, 1400); 

            currMob.getElement().offsetWidth;
            currMob.getElement().classList.add("ultimateAttackHit");
            setTimeout(function() { currMob.getElement().classList.remove("ultimateAttackHit"); }, 1400); 

            if (currMob.getHealth() <= 0)
                setTimeout(this.mobDeath, 1400);
        }
    }

    // called when mob dies
    mobDeath() {
        // SHOULD GIVE PLAYER GOLD AND EXPERIENCE HERE FOR KILLING MOB
        currMob.getElement().classList.add("death"); 
        setTimeout(function() {currMob.getElement().classList.remove("death");}, 1500);
        setTimeout(wildernessScreen, 1500); // go back to wilderness screen after death animation finishes
        unbindBattleBtns(); // unbinds the battle screen buttons
    }    
}