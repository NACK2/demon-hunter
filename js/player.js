class Player {
    #playerElement;
    #playerPos;
    #playerVel;
    #health;
    #weapon;

    constructor() { // sets player element, player position on land, and player velocity
        this.#playerElement = document.querySelector("#player");
        this.#playerPos = {
            x: parseInt(this.#playerElement.getBoundingClientRect().left),
            y: parseInt(this.#playerElement.getBoundingClientRect().top)
        };
        this.#playerVel = { // this is what will be used to move player
            x: 0, // - is left, + is right
            y: 0 // - is up, + is down
        };
    }

    setPlayerVel(x, y) { 
        this.#playerVel.x = x;
        this.#playerVel.y = y;
    }

    getPlayerVel() { 
        return this.#playerVel; // remember, this returns object
    }

    setPlayerPos(x, y) {
        this.#playerPos.x = x;
        this.#playerPos.y = y;
    }

    incPlayerPos(x, y) {
        this.#playerPos.x += x;
        this.#playerPos.y += y;
    }

    getPlayerPos() {
        return this.#playerPos; // remember, this returns object
    }

    // add attacks
}