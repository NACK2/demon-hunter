class Player {
    #playerElement;
    #playerPos;
    #playerVel;
    #health;
    #weapon;
    #PLAYER_SPEED;

    constructor() { // sets player element, player position on land, and player velocity
        this.#playerElement = document.querySelector("#player");
        this.#PLAYER_SPEED = 2; // default speed w/o speed boots
        this.#playerPos = {
            x: parseInt(this.#playerElement.getBoundingClientRect().left),
            y: parseInt(this.#playerElement.getBoundingClientRect().top)
        };
        this.#playerVel = { // this is what will be used to move player
            x: 0, // - is left, + is right
            y: 0 // - is up, + is down
        };
    }

    setPlayerVelX(x) { // didnt create a setPlayerVel() that sets both x and y bc we are always updating only one at a time 
        this.#playerVel.x = x;
    }

    setPlayerVelY(y) {
        this.#playerVel.y = y;
    }

    getPlayerVel() { 
        return this.#playerVel; // remember, this returns object
    }

    setPlayerPos(x, y) {
        this.#playerPos.x = x;
        this.#playerPos.y = y;
    }

    updatePlayerPos() {
        this.#playerPos.x += this.#playerVel.x;
        this.#playerPos.y += this.#playerVel.y;
    }

    getPlayerPos() {
        return this.#playerPos; // remember, this returns object
    }

    setPlayerSpeed(speed) {
        this.#PLAYER_SPEED = speed;
    }

    getPlayerSpeed() {
        return this.#PLAYER_SPEED;
    }

    getPlayerElement() {
        return this.#playerElement;
    }

    // add attacks
}