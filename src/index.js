import { 
    render,
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
        stateManager.addProject(new Project({}));
        storageManager.updateStorage(stateManager.projects);
    } else {
        const data = storageManager.getDataset('projects');
        stateManager.loadProjects(data);
    }

    // 3. Show current stateManager.projects and tasks
    render(stateManager.projects);

    const closePopup = () => {
        const popupOverlay = document.querySelector('.overlay');
        const popupInputs = document.querySelectorAll('.popup__input');

        popupInputs.forEach(input => {
            input.required = false;
            input.value = '';
        });
        popupOverlay.classList.add('close');
    }

    const openPopup = () => {
        const popupOverlay = document.querySelector('.overlay');
        const popupInputs = document.querySelectorAll('.popup__input');

        popupInputs.forEach(input => input.required = true);
        popupOverlay.classList.remove('close');
    }

    const closeTask = (e) => {
        const taskCard = e.target.closest('.tasks__card');
        console.log(taskCard)
        stateManager.removeTask(taskCard.dataset.id, 'default');
        taskCard.remove();
    }

    const eventHandler = new EventHandler(
        stateManager.addProject,
        stateManager.addTask,
        storageManager.updateStorage,
        user.addXP,
        render,
        closePopup,
        openPopup,
        closeTask
    );

    document.addEventListener('click', (e) => {
        console.log(e.target)
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
});