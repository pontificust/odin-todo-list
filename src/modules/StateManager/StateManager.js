import { Task } from "../Task/Task.js";
import { Project } from "../Project/Project.js";

export class StateManager {
    projects = []
    event = new CustomEvent('updateStorage')

    constructor(project) {
        this.projects.push(project);
    }

    loadProjects(data) {
        this.projects = data;
        console.log(this.projects)
    }

    hydrate() {

        //2. Hydrate data from the localStorage
        for (let project of this.projects) {
            project = new Project(project);
            let tasks = project.tasks;
            for (let task of tasks) {
                task = new Task(task);
            }
        }
        console.log(this.projects)
    }

    addProject = () => {
        const title = prompt(`Input project's name`, '');
        const color = prompt(`Input project's color`, 'grey');

        const newProject = new Project({ title, color });
        console.log(this.projects)
        this.projects.push(newProject);
        document.dispatchEvent(this.event);
    }

    addTask = () => {
        const title = prompt(`Input task's name`, '');
        const description = prompt(`Input task's description`, '');
        const dueDate = prompt(`Input task's dueDate`, '');
        const priority = prompt(`Input task's priority`, '');
        const projectTitle = prompt(`Input project's name`, '0');

        const newTask = new Task({ title, description, dueDate, priority });
        this.projects.find(project => project.title === projectTitle).addTask(newTask);
        document.dispatchEvent(this.event);
    }
}