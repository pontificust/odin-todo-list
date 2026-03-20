export class EventHandler {
    constructor(addProject, addTask, updateStorage, addXP, render) {
        this.click = {
            'project': addProject,
            'task': addTask,
        };
        this.updateStorage = (projects) => {
            updateStorage(projects);
            render(projects);
        };
        this.taskFinished = (e) => {
            addXP(e.xp);
        };
    }
}