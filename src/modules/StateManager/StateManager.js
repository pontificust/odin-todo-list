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
        return Object.values(this.projects).some(project => project.title === title);
    }

    addProject = ({title, color, tasks, id}) => {
        if (this.#isProjectExist(title)) {
            return;
        }

        const newProject = new Project({ title, color, tasks, id });
        this.projects[newProject.id] = newProject;
        document.dispatchEvent(this.event);
    }

    addTask = (taskData, currentProjectId) => {
        const newTask = new Task(taskData);
        this.projects[currentProjectId].addTask(newTask);
        document.dispatchEvent(this.event);
    }

    removeTask = (taskId) => {
        this.projects[Object.keys(this.projects)[0]].removeTask(taskId);
        document.dispatchEvent(this.event);
    }

    removeProject = (projectId) => {
        
        delete this.projects[projectId];
        document.dispatchEvent(this.event);
    }
}