import { Task } from "../Task/Task.js";
import { Project } from "../Project/Project.js";

export class StateManager {
    projects = []
    event = new CustomEvent('updateStorage')

    constructor() {
    }

    loadProjects(data) {
        this.projects = data;
        console.log(this.projects);
    }

    hydrate() {

        this.projects = this.projects.map(project => {
            const hydratedProject = new Project(project);
            hydratedProject.tasks = hydratedProject.tasks.map(task => new Task(task));
            return hydratedProject;
        });
        console.log(this.projects);
    }

    addProject = (defaultProject) => {
        console.log(this.projects)
        if(defaultProject) {
            this.projects.push(defaultProject);
            return;
        }
        const title = prompt(`Input project's name`, '');
        const color = prompt(`Input project's color`, 'grey');

        const newProject = new Project({ title, color });
        console.log(this.projects);
        this.projects.push(newProject);
        document.dispatchEvent(this.event);
    }

    addTask = () => {
        const title = prompt(`Input task's name`, '');
        const description = prompt(`Input task's description`, '');
        const dueDate = prompt(`Input task's dueDate`, '');
        const priority = prompt(`Input task's priority`, '');
        const projectTitle = prompt(`Input project's name`, 'default');

        const newTask = new Task({ title, description, dueDate, priority });
        this.projects.find(project => project.title === projectTitle).addTask(newTask);
        document.dispatchEvent(this.event);
    }
}