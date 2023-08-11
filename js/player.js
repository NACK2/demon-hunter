class Player {
    // # means private field/class
    #playerElement; 
    #playerPos;
    #playerVel;
    #health;
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

        this.#playerPos = { // players coordinates 
            x: parseInt(this.#playerElement.getBoundingClientRect().left),
            y: parseInt(this.#playerElement.getBoundingClientRect().top)
        };

        this.#playerVel = { // this is what will be used to move player
            x: 0, // - is left, + is right
            y: 0 // - is up, + is down
        };
    }

    getVelX(x) { // didnt create a setPlayerVel() that sets both x and y bc we are always updating only one at a time 
        this.#playerVel.x = x;
    }

    getVelY(y) {
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
        return this.#equippedWeapon;
    }

    getHealth() {
        return this.#health;
    }

    getHaveBoots() {
        return this.#haveBoots;
    }

    // THESE ATTACKS WILL BE CHANGED LATER ON TO VARY DEPENDING ON WHAT WEAPON USER HAS
    basicAttack(mob) {
        // in order to have basicAttackHit animation every time, have to remove it then readd it each time
        mob.getElement().classList.remove("basicAttackHit");   

        // must make sure the mob has 0 children, if it # of children > 0 that means another attack is in progress
        if (mob.getElement().childNodes.length == 0 && mob.getHealth() > 0) { 
            mob.decHealth(this.#equippedWeapon.power); // remove mob's health from health and health bar

            let basicAttack = document.createElement("div");
            basicAttack.id = "basicAttack";
            mob.getElement().appendChild(basicAttack); // layering basicAttack animation on top of mob 
            
            // after attack animation is done, remove the attack animation from the mob
            setTimeout(function() { mob.getElement().removeChild(basicAttack); }, 1000); 

            if (mob.getHealth() > 0)  { // getting hit by basic attack animation, won't occur if mob dies
                // https://www.harrytheo.com/blog/2021/02/restart-a-css-animation-with-javascript/
                // according to that link, to restart animation have to trigger "DOM Overflow" by calling element.offsetWidth
                mob.getElement().offsetWidth;
                mob.getElement().classList.add("basicAttackHit");
            }
       }
    }
}