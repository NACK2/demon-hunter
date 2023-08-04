class Player {
    #playerElement; // # means private field/class
    #playerPos;
    #playerVel;
    #health;
    #weapon; // currently equipped weapon, not all weapons
    #PLAYER_SPEED;
    #haveBoots

    constructor() {
        this.#playerElement = document.querySelector("#player");
        this.#PLAYER_SPEED = 2; // default speed w/o speed boots
        this.#haveBoots = JSON.parse(localStorage.getItem("boots")); // checking if player bought speed boots 

        this.#playerPos = {
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

    getHaveBoots() {
        return this.#haveBoots;
    }

    // add attacks
}