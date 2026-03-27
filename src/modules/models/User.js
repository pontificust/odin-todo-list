export class User {
    rank = 'novice'
    level = 1
    totalXP = 0

    constructor({name, totalXP, level, rank, id}) {
        this.name = name;
        this.rank = rank;
        this.totalXP = totalXP;
        this.level = level;
        this.id = id || crypto.randomUUID();
    }

    #levelUp() {
        this.level += 1;
    }

    addXP = (xp) => {
        this.totalXP += xp;
        if(this.totalXP >= this.level * 1000) {
            this.#levelUp();
        }
    }
}