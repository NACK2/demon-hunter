class Slime {
    #slime;
    #health;

    constructor() {
        this.#slime = document.createElement("slimeDiv");
        this.#slime.id = "wildSlime";
    }

    getSlime() {
        return this.#slime;
    }
}