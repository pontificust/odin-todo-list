import { EventHandler } from "../eventHandler/eventHandler.js";
import { Project } from "../Project/Project.js";
import { StorageManager } from "../StorageManager/StorageManager.js";
import { StateManager } from "../StateManager/StateManager.js";

export const app = () => {

    const storageManager = new StorageManager();
    const stateManager = new StateManager();

    //1. Load data form the localStorage
    if (storageManager.isEmpty()) {
        stateManager.loadProjects(new Project({}));
        storageManager.updateStorage(stateManager.projects);
    } else {
        const data = storageManager.getDataset('projects');
        stateManager.loadProjects(data);
        stateManager.hydrate();
        console.log(stateManager.projects)
    }

    // 3. Show current stateManager.projects and tasks

    const render = (projects) => {
        for (let i = 0; i < projects.length; i += 1) {
            console.log(`${i}. ${projects[i].title}`);
            const tasks = projects[i].tasks;
            for (let j = 0; j < tasks.length; j += 1) {
                console.log(`${j}. ${tasks[j].title}`);
            }
        }
        console.log(projects)
    }

    render(stateManager.projects);

    const eventHandler = new EventHandler(
        stateManager.addProject,
        stateManager.addTask,
        storageManager.updateStorage,
        render
    );

    document.addEventListener('click', (e) => {
        if (e.target.dataset.id) {
            eventHandler.click[e.target.dataset.id]();
        }
    });

    document.addEventListener('updateStorage', () => {
        eventHandler.updateStorage(stateManager.projects);
    });
}