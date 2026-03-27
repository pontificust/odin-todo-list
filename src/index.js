import {
    RenderManger,
    taskStructure,
    projectStructure,
    StateManager,
    StorageManager,
    EventHandler,
    Project,
    User,
    projects
} from "./modules/modules.js";

import "./assets/css/global.css";

window.addEventListener('DOMContentLoaded', () => {
    // 0. Initialization of data managers
    const storageManager = new StorageManager();
    const stateManager = new StateManager();
    const user = new User({
        name: 'Courier',
        totalXP: 0,
        level: 1, 
        rank: 'novice'
    });

    // 1. Load data form the localStorage
    if (storageManager.isEmpty()) {
        stateManager.addUser(user);
        projects.forEach( project => {
            console.log(project)
            stateManager.addProject(project)

        });
        storageManager.updateStorage(stateManager.projects, stateManager.users);
    } else {
        const data = storageManager.getDataset('projects', 'users');
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
    renderManager.render();

    const eventHandler = new EventHandler(
        stateManager,
        renderManager,
        storageManager,
    );

    document.addEventListener('click', (e) => {
        if (e.target.dataset.id && e.target.tagName === 'BUTTON') {
            renderManager.safeTransition(() => eventHandler.click[e.target.dataset.id](e));
        }
    });

    document.addEventListener('submit', (e) => {
        e.preventDefault();
        if (e.target.dataset.id) {
            renderManager.safeTransition(() => eventHandler.submit[e.target.dataset.id](e));
        }
    });

    document.addEventListener('updateStorage', (e) => {
        console.log(e.detail)
        renderManager.safeTransition(() => eventHandler.updateStorage(e, stateManager.projects, stateManager.users));
    });

    document.addEventListener('input', (e) => {
        if (e.target.id === "color" || e.target.id === 'filter') {
            console.log(e.target)
            renderManager.safeTransition(() => eventHandler.input[e.target.id](e));
        }
    });
});