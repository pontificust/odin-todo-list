import { EventHanler } from "../eventHandler/eventHandler.js";
import { projects } from "./appData.js";
import { Project } from "../Project/Project.js";
import { Task } from "../Task/Task.js";

export const app = () => {

    const addProject = () => {
        const title = prompt(`Input project's name`, '');
        const color = prompt(`Input project's color`, 'grey');

        const newProject = new Project(title, color);
        projects.push(newProject);
        console.log(projects);
    }

    const addTask = () => {
        const title = prompt(`Input task's name`, '');
        const description = prompt(`Input task's description`, '');
        const dueDate = prompt(`Input task's dueDate`, '');
        const priority = prompt(`Input task's priority`, '');
        const project = prompt(`Input project's name`, '0');

        const newTask = new Task(title, description, dueDate, priority);
        projects[+project].addTask(newTask);
        console.log(projects);
    }

    const eventHandler = new EventHanler(addProject, addTask);
    // 1. Firstly, we need user to be able to add a task or a project.
    document.addEventListener('click', (e) => {
        if(e.target.dataset.id){
            eventHandler.click[e.target.dataset.id]();
        }
    }); 
}