export class Task {
    #xp;

    constructor({ title, description, dueDate, priority }) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.#xp = priority === 'critical' ? 300 : 
        priority === 'moderate' ? 200 : 100;
        this.id = crypto.randomUUID();
    }

    getXP() {
        return this.#xp;
    }
}