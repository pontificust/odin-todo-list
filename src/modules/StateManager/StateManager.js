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

    #isProjectExist(title) {
        return this.projects.some(project => project.title === title);
    }

    addProject = (defaultProject) => {
        console.log(this.projects)
        if (defaultProject) {
            this.projects.push(defaultProject);
            return;
        }
        let title = prompt(`Input project's name`, '');
        if (this.#isProjectExist(title)) {
            console.log(`Please chose another name for your project.
                 Provided name exists`);
            title = prompt(`Input project's name`, '');
        }
        const color = prompt(`Input project's color`, 'grey');

        const newProject = new Project({ title, color });
        console.log(this.projects);
        this.projects.push(newProject);
        document.dispatchEvent(this.event);
    }

    addTask = (e) => {
        e.preventDefault();

        const { title, description, dueDate, priority } = Object.fromEntries(new FormData(e.target));
        const projectTitle = 'default';
        const newTask = new Task({ title, description, dueDate, priority });
        this.projects.find(project => project.title === projectTitle).addTask(newTask);
        document.dispatchEvent(this.event);
        console.log(this.projects);
    }
}