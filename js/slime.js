// LATER ON ALL MOBS SHOULD EXTEND A MOB CLASS AS MANY OVERLAPPING CLASSES WILL EXIST

class Slime {
    #healthBarContainer = document.querySelector("#healthBarContainer");
    #healthBar = document.querySelector("#healthBarGreen");
    #slimeElement;
    #health;
    #MAX_HEALTH;
    #xp; // this is the amount of XP slime gives when killed

    constructor(slimeId) { // two types of slimeId: #wildSlime (wilderness slime) and #battleSlime (battle screen slime)
        this.#slimeElement = document.createElement("div");
        this.#slimeElement.id = slimeId;
        this.#healthBarContainer.style.display = "flex";
        this.#healthBar.style.width = "100%";
        this.#MAX_HEALTH = 30; // default health
        this.#health = 30; // subject to change
        this.#xp = 20; // subject to change
    }

    getElement() {
        return this.#slimeElement;
    }

    decHealth(health) {
        this.#health -= health;
        this.#healthBar.style.width = this.#health / this.#MAX_HEALTH * 100 + "%";

        // slime died
        if (this.#health <= 0) {
            this.#slimeElement.parentNode.removeChild(this.#slimeElement);
            this.#healthBarContainer.style.display = "none";
        }
    }

    getHealth() {
        return this.#health;
    }

    getXp() {
        return this.#xp;
    }

    // add attacks
}