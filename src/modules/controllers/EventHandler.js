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
                const projectId = renderManager.currentProjectId;
                const taskType = renderManager.currentTasksArr;

                stateManager.removeTask(taskId, projectId, taskType);

                renderManager.animateCardRemoval(taskCard, 'hide');
            },
            'closeProject': (e) => {
                const projectCard = e.target.closest('.aside__menu-project');
                const projectId = projectCard.dataset.id;

                if ('default' === projectId) {
                    return;
                }
                renderManager.currentProjectId = 'default';
                stateManager.removeProject(projectId);
                renderManager.animateCardRemoval(projectCard, 'hide');
            },
            'openProject': (e) => {
                const prevProjectCard = document.querySelector(`[data-id="${renderManager.currentProjectId}"]`);
                prevProjectCard.classList.remove('active');

                renderManager.currentProjectId = e.target.closest('li').dataset.id;
                const projectCard = document.querySelector(`[data-id="${renderManager.currentProjectId}"]`);
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
                const projectId = renderManager.currentProjectId;
                const userId = renderManager.currentUserId;

                stateManager.completeTask(taskId, projectId, userId);
                taskCard.remove();
                renderManager.renderLevel();
            },
        };
        this.submit = {
            'project': (e) => {
                const projectData = getFormData(e);
                stateManager.addProject(projectData);
                renderManager.closePopup(e);
            },
            'task': (e) => {
                const taskData = getFormData(e);

                stateManager.addTask(taskData, renderManager.currentProjectId);
                renderManager.closePopup(e);
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

                renderManager.activeFilter = filterName;
                renderManager.renderTasks();
            },
            'sort': (e) => {
                const sortName = e.target.value;

                renderManager.activeSort = sortName;
                renderManager.renderTasks();
            },
        };
        this.updateStorage = (projects, users) => {
            storageManager.updateStorage(projects, users);
            renderManager.render();
        };
    }
}