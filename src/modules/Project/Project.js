export class Project {
    #isArchived = false;

    constructor({title = 'default', color = 'gray', tasks = [], id}) {
        this.title = title;
        this.color = color;
        this.tasks = tasks;
        this.id = id || crypto.randomUUID();
    }

    addTask(task) {
        this.tasks.push(task);
    }

    removeTask(id) {
        const indexToRemove = this.tasks.findIndex(task => task.id === id);
        this.tasks.splice(indexToRemove, 1);
    }

    finishProject() {
        this.#isArchived = true;
    }

    restartProject() {
        this.#isArchived = false;
    }
}