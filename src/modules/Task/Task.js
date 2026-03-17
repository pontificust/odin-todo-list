export class Task {
    #isDone = false;

    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.id = crypto.randomUUID();
    }

    finishTask() {
        this.#isDone = true;
    }

    restartTask() {
        this.#isDone = false;
    }
}