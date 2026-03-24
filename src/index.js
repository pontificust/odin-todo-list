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

    const closePopup = (e) => {
        const popupOverlay = e.target.closest('.overlay');
        const popupInputs = popupOverlay.querySelectorAll('.popup__input');

        popupInputs.forEach(input => {
            input.required = false;
            input.value = '';
        });
        popupOverlay.classList.add('close');
    }

    const openPopup = (e) => {
        let popupOverlay;
        if (e.target.dataset.id === 'openPopup') {
            popupOverlay = document.querySelector('#task');
        } else {
            popupOverlay = document.querySelector('#project');
        }
        const popupInputs = popupOverlay.querySelectorAll('.popup__input');

        popupInputs.forEach(input => input.required = true);
        popupOverlay.classList.remove('close');
    }

    const closeTask = (e) => {
        const taskCard = e.target.closest('.tasks__card');
        console.log(taskCard)
        stateManager.removeTask(taskCard.dataset.id, 'default');
        taskCard.remove();
    }

    const updateOutput = (e) => {
        const output = e.target.nextElementSibling;
        output.textContent = e.target.value;
        return output;
    }
    
    const showColorInput = (e) => {
        const output = updateOutput(e);
        const color = output.textContent;
        output.style.borderColor = color;
    }

    const eventHandler = new EventHandler(
        stateManager.addProject,
        stateManager.addTask,
        storageManager.updateStorage,
        user.addXP,
        render,
        closePopup,
        openPopup,
        closeTask,
        showColorInput,
    );

    document.addEventListener('click', (e) => {
        // console.log(e.target)
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