export class User {
    #rank = 'novice'
    #level = 1
    #totalXP = 0

    constructor(name) {
        this.name = name;
    }

    #levelUp() {
        this.#level += 1;
    }

    addXP = (xp) => {
        this.#totalXP += xp;
        if(this.#totalXP >= this.#level * 1000) {
            this.#levelUp();
        }
    }
}