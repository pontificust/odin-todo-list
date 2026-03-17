export class Project {
    #tasks = [];
    #isArchived = false;

    constructor(title, color) {
        this.title = title;
        this.color = color;
    }

    addTask(task) {
        this.#tasks.push(task);
    }

    removeTask(id) {
        const indexToRemove = this.#tasks.findIndex(task => task.id === id);
        this.#tasks.splice(indexToRemove, 1);
    }

    finishProject() {
        this.#isArchived = true;
    }

    restartProject() {
        this.#isArchived = false;
    }
}