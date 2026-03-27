export class Project {
    #isArchived = false;

    constructor({ 
        title = 'home',
        color = '#696969',
        activeTasks = [],
        completedTasks = [],
        id
    }) {
        this.title = title;
        this.color = color;
        this.activeTasks = activeTasks;
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
        if(indexToMove === -1) {
            return;
        }
        
        this.completedTasks.push(taskToMove);
        this.removeTask(indexToMove);
        return taskToMove;
    }

    finishProject() {
        this.#isArchived = true;
    }

    restartProject() {
        this.#isArchived = false;
    }
}