import {
    RenderManger,
    taskStructure,
    projectStructure,
    taskFormStructure,
    StateManager,
    StorageManager,
    EventHandler,
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
        rank: 'drifter',
        id: 'defaultUser',
    });

    // 1. Load data form the localStorage
    if (storageManager.isEmpty()) {
        stateManager.addUser(user);
        projects.forEach(project => {
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
        taskFormStructure
    );

    // 3. Show current stateManager.projects and tasks
    renderManager.render();

    const eventHandler = new EventHandler(
        stateManager,
        renderManager,
        storageManager,
    );

    document.addEventListener('click', (e) => {
        if ((e.target.dataset.id && e.target.tagName === 'BUTTON') ||
            e.target.dataset.id === 'closePopup' || e.target.id === 'openPopup') {
            if (e.target.id === 'openPopup') {
                renderManager.safeTransition(() => eventHandler.click[e.target.id](e, e.target.dataset.id));
                return;
            }
            renderManager.safeTransition(() => eventHandler.click[e.target.dataset.id](e));
        }
    });

    document.addEventListener('submit', (e) => {
        e.preventDefault();
        if (e.target.dataset.id) {
            renderManager.safeTransition(() => eventHandler.submit[e.target.dataset.id](e));
        }
    });

    document.addEventListener('updateStorage', () => {
        eventHandler.updateStorage(stateManager.projects, stateManager.users);
    });

    document.addEventListener('input', (e) => {
        if (
            e.target.id === 'filter' ||
            e.target.id === 'sort' ||
            e.target.dataset.id === 'openTab'
        ) {
            const id = e.target.dataset.id || e.target.id;
            renderManager.safeTransition(() => eventHandler.input[id](e));
        } else if (e.target.id === 'color') {
            eventHandler.input[e.target.id](e);
        }
    });
});