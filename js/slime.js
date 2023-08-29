// LATER ON ALL MOBS SHOULD EXTEND A MOB CLASS AS MANY OVERLAPPING CLASSES WILL EXIST
class Slime {
    #healthBarContainer;
    #healthBar;
    #slimeElement;
    #health; // slimes health
    #MAX_HEALTH;
    #gold // amount of gold slime gives when killed
    #xp; // amount of XP slime gives when killed

    constructor() {
        this.#slimeElement = document.querySelector("#battleSlime");
        this.#healthBarContainer = document.querySelector("#healthBarContainer");
        this.#healthBar = document.querySelector("#healthBarGreen");

        this.#healthBarContainer.style.visibility = "visible"; // making visible bc could be invisible if mob previously died
        this.#healthBar.style.width = "100%"; // making health bar 100% health/green
        this.#MAX_HEALTH = 30; // default health
        this.#health = 30;
        this.#gold = 10;
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

    getHealth() { // slimes health
        return this.#health;
    }

    dropGold() { // amount of gold dropped when slime is killed
        return this.#gold;
    }

    dropXp() { // amount of xp dropped when slime is killed
        return this.#xp;
    }

    attack() {
        // groundShatter is 3 animations in one class, after animation ends onanimationend() is triggered and
        // the groundShatter class is removed, but in this case onanimationend() is triggered only when the first animation
        // is finished, so using animationCount iterator to make sure to wait for all 3 animations to finish
        let animationCount = 0; 
        this.#slimeElement.classList.add("groundShatter"); // slimes ground shatter attack
        
        this.#slimeElement.onanimationstart = () => { 
            this.#healthBarContainer.style.visibility = "hidden";
        }

        this.#slimeElement.onanimationend = () => {
            ++animationCount;
            if (animationCount == 3) {
                currMob.getElement().classList.remove("groundShatter");
                this.#healthBarContainer.style.visibility = "visible";
            }
        }
    }
}