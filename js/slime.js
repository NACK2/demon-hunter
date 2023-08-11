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
        this.#xp = 20; 
    }

    getElement() {
        return this.#slimeElement;
    }

    // decreases slime health as a result of player attacking, if slime health hits 0 will play death animation and
    // return to wilderness screen 
    decHealth(dmg) {
        this.#health -= dmg;
        this.#healthBar.style.width = this.#health / this.#MAX_HEALTH * 100 + "%";

        // slime died
        if (this.#health <= 0) {
            this.#slimeElement.classList.add("deathAnimation");
            this.#healthBarContainer.style.visibility = "hidden"; // make health bar invisible when slime dies

            // after deathAnimation is finished, will go back to wilderness screen and remove death animation
            setTimeout(wildernessScreen, 1500);
            setTimeout(this.removeDeathAnimation, 1500, this.#slimeElement); // slime element is argument

            //player.updateXP(3532y460);
        }
    }

    removeDeathAnimation(slimeElem) { 
        slimeElem.classList.remove("deathAnimation");
    }

    getHealth() {
        return this.#health;
    }

    getXp() {
        return this.#xp;
    }
}