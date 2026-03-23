import { Task } from "../Task/Task.js";
import { Project } from "../Project/Project.js";

export class StateManager {
    projects = {}
    event = new CustomEvent('updateStorage')

    constructor() {
    }

    loadProjects(data) {
        this.projects = data;
        this.#hydrate();
    }

    #hydrate() {

        this.projects = Object.fromEntries(Object.entries(this.projects).map(project => {
            const hydratedProject = new Project(project[1]);
            hydratedProject.tasks = hydratedProject.tasks.map(task => new Task(task));
            return [hydratedProject.id, hydratedProject];
        }));
    }

    #isProjectExist(title) {
        return this.projects.some(project => project.title === title);
    }

    addProject = (defaultProject) => {
        if (defaultProject) {
            this.projects[defaultProject.id] = defaultProject;
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
        this.projects[newProject.id] = newProject;
        document.dispatchEvent(this.event);
    }

    addTask = (title, description, dueDate, priority) => {
        const projectId = Object.keys(this.projects)[0];
        const newTask = new Task({ title, description, dueDate, priority });
        this.projects[projectId].addTask(newTask);
        document.dispatchEvent(this.event);
    }

    removeTask = (taskId) => {
        this.projects[Object.keys(this.projects)[0]].removeTask(taskId);
        document.dispatchEvent(this.event);
    }
}