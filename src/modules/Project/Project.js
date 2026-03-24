export class Project {
    #isArchived = false;

    constructor({ title = 'home', color = 'gray', tasks = [], completedTasks = [], id }) {
        this.title = title;
        this.color = color;
        this.activeTasks = tasks;
        this.completedTasks = completedTasks;
        this.id = id || crypto.randomUUID();
    }

    addTask(task) {
        this.activeTasks.push(task);
    }

    removeTask(id, tasksArray = 'activeTasks') {
        const indexToRemove = this[tasksArray].findIndex(task => task.id === id);
        this[tasksArray].splice(indexToRemove, 1);
    }

    completeTask(taskId) {
        const indexToMove = this.activeTasks.findIndex(task => task.id === taskId);
        const taskToMove = this.activeTasks[indexToMove];

        this.completedTasks.push(taskToMove);
    }

    finishProject() {
        this.#isArchived = true;
    }

    restartProject() {
        this.#isArchived = false;
    }
}