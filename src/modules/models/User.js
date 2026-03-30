export class User {
  rank = "drifter";
  level = 1;
  totalXP = 0;

  constructor({ name, totalXP, level, rank, id }) {
    this.name = name;
    this.rank = rank;
    this.totalXP = totalXP;
    this.level = level;
    this.id = id || crypto.randomUUID();
  }

  #levelUp() {
    this.level += 1;
  }

  addXP = (xp, ranks) => {
    this.totalXP += xp;
    if (this.totalXP >= this.level * 1000) {
      this.#levelUp();
      this.#setRank(ranks);
    }
  };

  #setRank = (ranks) => {
    const rankId = this.level > 5 ? Math.ceil(this.level / 5) : 0;

    if (rankId > 10) {
      this.rank = ranks[10];
      return;
    }
    this.rank = ranks[rankId];
  };
}
