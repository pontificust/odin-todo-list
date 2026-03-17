export class EventHanler {
    constructor(addProject, addTask) {
        this.click = {
            'project': addProject,
            'task': addTask,
        }
    }
}