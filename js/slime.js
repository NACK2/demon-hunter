// LATER ON ALL MOBS SHOULD EXTEND A MOB CLASS AS MANY OVERLAPPING CLASSES WILL EXIST
class Slime {
    #healthBarContainer;
    #healthBar;
    #slimeElement;
    #health;
    #MAX_HEALTH;
    #xp; // this is the amount of XP slime gives when killed

    constructor() {
        this.#slimeElement = document.querySelector("#battleSlime");
        this.#healthBarContainer = document.querySelector("#healthBarContainer");
        this.#healthBar = document.querySelector("#healthBarGreen");

        this.#healthBarContainer.style.visibility = "visible"; // making visible bc could be invisible if mob previously died
        this.#healthBar.style.width = "100%"; // making health bar 100% health/green
        this.#MAX_HEALTH = 30; // default health
        this.#health = 30;
        this.#xp = 10; 
    }

    getElement() {
        return this.#slimeElement;
    }

    // decreases slime health as a result of player attacking, if slime health hits 0 will play death animation and
    // return to wilderness screen 
    decHealth(dmg) {
        this.#health -= dmg;
        let healthBarPercent = this.#health / this.#MAX_HEALTH * 100 + "%";

        if (healthBarPercent < "0%") // health bar won't recognize number if it's negative
            this.#healthBar.style.width = "0%";
        else 
            this.#healthBar.style.width = healthBarPercent;
    }

    getHealth() {
        return this.#health;
    }

    getXp() {
        return this.#xp;
    }
}