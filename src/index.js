import { 
    render,
    StateManager,
    StorageManager,
    EventHandler,
    Project
 } from "./modules/modules.js"

window.addEventListener('DOMContentLoaded', () => {
    // 0. Initialization of data managers
    const storageManager = new StorageManager();
    const stateManager = new StateManager();

    // 1. Load data form the localStorage
    if (storageManager.isEmpty()) {
        stateManager.addProject(new Project({}));
        storageManager.updateStorage(stateManager.projects);
    } else {
        const data = storageManager.getDataset('projects');
        stateManager.loadProjects(data);
        stateManager.hydrate();
        console.log(stateManager.projects);
    }

    // 3. Show current stateManager.projects and tasks
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
});