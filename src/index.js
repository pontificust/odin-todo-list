import {
    RenderManger,
    taskStructure,
    projectStructure,
    StateManager,
    StorageManager,
    EventHandler,
    Project,
    User,
    Task
} from "./modules/modules.js";

import "./assets/css/global.css";

window.addEventListener('DOMContentLoaded', () => {
    // 0. Initialization of data managers
    const storageManager = new StorageManager();
    const stateManager = new StateManager();
    const user = new User('Courier');
    
    // 1. Load data form the localStorage
    if (storageManager.isEmpty()) {
        stateManager.addProject(new Project({ 
            title: 'home',
            color: 'grey',
            activeTasks: [],
            completedTasks: [],
            id: 'default', 
        }));
        storageManager.updateStorage(stateManager.projects);
    } else {
        const data = storageManager.getDataset('projects');
        stateManager.loadProjects(data);
    }

    const renderManager = new RenderManger(
        '.tasks__cards',
        '.aside__menu-projects',
        taskStructure,
        projectStructure,
        stateManager,
    );

    // 3. Show current stateManager.projects and tasks
    renderManager.render(stateManager.projects);

    const eventHandler = new EventHandler(
        stateManager,
        renderManager,
        user,
        storageManager,
    );

    document.addEventListener('click', (e) => {
        if (e.target.dataset.id && e.target.tagName === 'BUTTON') {
            eventHandler.click[e.target.dataset.id](e);
        }
    });

    document.addEventListener('submit', (e) => {
        if (e.target.dataset.id) {
            eventHandler.submit[e.target.dataset.id](e);
        }
    });

    document.addEventListener('updateStorage', () => {
        eventHandler.updateStorage(stateManager.projects);
    });

    document.addEventListener('taskFinished', (e) => {
        eventHandler.taskFinished(e.detail.xp);
    });

    document.addEventListener('input', (e) => {
        if(e.target.id === "color") {
            eventHandler.input[e.target.id](e);
        }
    });
});