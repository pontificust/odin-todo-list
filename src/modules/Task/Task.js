export class Task {
    #isDone = false;
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

    finishTask() {
        this.#isDone = true;
        const xp = this.priority * 100;
        let taskFinishedEvent = new CustomEvent('taskFinished', {
            detail: {
                xp: this.#xp,
            }
        });
        console.log(taskFinishedEvent)
        document.dispatchEvent(taskFinishedEvent);
    }

    getXp() {
        console.log(this.#xp)
        return this.#xp;
    }

    restartTask() {
        this.#isDone = false;
    }
}