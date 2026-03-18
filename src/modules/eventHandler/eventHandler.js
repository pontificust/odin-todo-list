export class EventHandler {
    constructor(addProject, addTask, updateStorage, render) {
        this.click = {
            'project': addProject,
            'task': addTask,
        };
        this.updateStorage = (projects) => {
            updateStorage(projects);
            render(projects);
        }
    }
}