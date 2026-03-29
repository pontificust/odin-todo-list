import { getFormData } from "../utils.js";

export class EventHandler {
    constructor(
        stateManager,
        renderManager,
        storageManager,
    ) {
        this.click = {
            'closePopup': (e) => {
                const popupOverlay = e.target.closest('.overlay');

                renderManager.hidePopup(popupOverlay);
            },
            'openPopup': (e) => {
                let popupType = `#${e.target.dataset.popupType}`;

                renderManager.showPopup(popupType);
            },
            'closeTask': (e) => {
                const taskCard = e.target.closest('.tasks__card');
                const taskId = taskCard.dataset.id;
                const projectId = stateManager.uiState.currentProjectId;
                const taskType = stateManager.uiState.currentTasksArr;

                stateManager.removeTask(taskId, projectId, taskType);

                renderManager.animateCardRemoval(taskCard, 'hide');
            },
            'closeProject': (e) => {
                const projectCard = e.target.closest('.aside__menu-project');
                const projectId = projectCard.dataset.id;

                if ('defaultProject' === projectId) {
                    return;
                }
                stateManager.setUIState('currentProjectId', 'defaultProject');
                stateManager.removeProject(projectId);
                renderManager.animateCardRemoval(projectCard, 'hide');
            },
            'openProject': (e) => {
                let { currentProjectId } = stateManager.uiState;
                console.log(stateManager.uiState.currentProjectId)
                const prevProjectCard = document.querySelector(`[data-id="${currentProjectId}"]`);
                prevProjectCard.classList.remove('active');

                currentProjectId = e.target.closest('li').dataset.id;
                stateManager.setUIState('currentProjectId', currentProjectId);
                const projectCard = document.querySelector(`[data-id="${currentProjectId}"]`);
                projectCard.classList.add('active');

                renderManager.openTab('openActive');
            },
            'openTab': (e) => {
                const tabType = e.target.dataset.tabType;

                renderManager.openTab(tabType);
            },
            'completeTask': (e) => {
                const taskCard = e.target.closest('.tasks__card');
                const taskId = taskCard.dataset.id;
                const projectId = stateManager.uiState.currentProjectId;
                const userId = stateManager.uiState.currentUserId;

                stateManager.completeTask(taskId, projectId, userId);
                taskCard.remove();
                renderManager.renderLevel();
            },
        };
        this.submit = {
            'project': (e) => {
                const projectData = getFormData(e);
                const popupOverlay = e.target.closest('.overlay');

                stateManager.addProject(projectData);
                renderManager.hidePopup(popupOverlay);
            },
            'task': (e) => {
                const taskData = getFormData(e);
                const popupOverlay = e.target.closest('.overlay');

                stateManager.addTask(taskData, stateManager.uiState.currentProjectId);
                renderManager.hidePopup(popupOverlay);
            },
        };
        this.input = {
            'color': (e) => {
                const output = e.target.nextElementSibling;
                const colorValue = e.target.value;

                renderManager.showColorInput(output, colorValue);
            },
            'filter': (e) => {
                const filterName = e.target.value;

                stateManager.setUIState('activeFilter', filterName);
                console.log(stateManager.uiState)
                renderManager.renderTasks();
            },
            'sort': (e) => {
                const sortName = e.target.value;

                stateManager.setUIState('activeSort', sortName);
                renderManager.renderTasks();
            },
        };
        this.updateStorage = (projects, users) => {
            storageManager.updateStorage(projects, users);
            renderManager.render();
        };
    }
}