class Slime {
    #slimeElement;
    #health;
    #xp; // this is the amount of XP slime gives when killed

    constructor() {
        this.#slimeElement = document.createElement("slimeDiv");
        this.#slimeElement.id = "wildSlime";
        this.#health = 30; // subject to change
        this.#xp = 20; // subject to change
    }

    getElement() {
        return this.#slimeElement;
    }

    getHealth() {
        return this.#health;
    }

    // add attacks
}