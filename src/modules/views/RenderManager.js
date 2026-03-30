import { createElement } from "./createElement.js";
import { getContrastColor, calculateProgress } from "../utils.js";

export class RenderManger {

    constructor(
        tasksContainer,
        projectsContainer,
        taskStructure,
        projectStructure,
        stateManager,
        taskFormStructure,

    ) {
        this.tasksContainer = document.querySelector(tasksContainer);
        this.projectsContainer = document.querySelector(projectsContainer);
        this.taskStructure = taskStructure;
        this.projectStructure = projectStructure;
        this.taskFormStructure = taskFormStructure;
        this.stateManager = stateManager;
        this.ui = {
            levelBar: document.querySelector('.header__user-bar'),
            spanLevel: document.querySelector('[data-id="level"]'),
            spanRank: document.querySelector('[data-id="rank"]'),
            spanXp: document.querySelector('[data-id="xp"]'),
            popupOutput: document.querySelector('.popup__output'),
            tabs: document.querySelectorAll('.tasks__tab'),
            addTaskBtn: document.querySelector('.tasks__btn'),
            projectTitle: document.querySelector('.tasks__sector-title'),
        }
    }

    #parseTaskStructure() {
        const task = createElement(this.taskStructure);
        const taskName = task.querySelector('.tasks__name');
        const taskPriority = task.querySelector('.tasks__priority');
        const taskDate = task.querySelector('.tasks__date');
        const taskXp = task.querySelector('.tasks__xp');
        const tasksWrapper = task.querySelector('.tasks__card-wrapper');

        return { task, taskName, taskPriority, taskDate, taskXp, tasksWrapper };
    }

    #parseProjectStructure() {
        const projectCard = createElement(this.projectStructure);
        const projectIcon = projectCard.querySelector('.aside__menu-icon');
        const projectName = projectCard.querySelector('.aside__menu-name');
        const projectCardBtn = projectCard.querySelector('button');
        const projectCardBtnIcon = projectCardBtn.querySelector('svg');

        return {
            projectCard,
            projectIcon,
            projectName,
            projectCardBtn,
            projectCardBtnIcon,
        };
    }

    #getProcessedTasks() {
        const { currentProjectId, currentTasksArr, activeFilter, activeSort } = this.stateManager.uiState;
        const project = this.stateManager.projects[currentProjectId];
        let tasks = [...project[currentTasksArr]];

        if (activeFilter !== 'filterOff') {
            tasks = tasks.filter(task => {
                if (activeFilter === 'overdue') {
                    return new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);
                }
                if (activeFilter === 'upcoming') {
                    return new Date(task.dueDate) > new Date().setHours(0, 0, 0, 0);
                }
                return task.priority === activeFilter;
            })
        }

        if (activeSort !== 'sortOff') {
            tasks.sort((task1, task2) => {
                if (activeSort === 'chronological') {
                    return new Date(task1.dueDate).getTime() - new Date(task2.dueDate).getTime();
                }
                if (activeSort === 'reverse') {
                    return new Date(task2.dueDate).getTime() - new Date(task1.dueDate).getTime();
                }
                return task1.getXP() - task2.getXP();
            })
        }

        return tasks;
    }

    safeTransition(callback) {
        if (!document.startViewTransition) {
            callback();
            return;
        }

        document.startViewTransition(() => {
            callback();
        });
    }

    #createTaskElement(taskData) {
        const {
            task,
            taskName,
            taskPriority,
            taskDate,
            taskXp,
            tasksWrapper } = this.#parseTaskStructure();

        taskName.textContent = `${taskData.title}`;
        taskPriority.textContent = `[${taskData.priority}]`;
        taskPriority.classList.add(`${taskData.priority}`);
        taskDate.textContent = `due: ${taskData.dueDate}`;
        taskXp.textContent = `REWARD: + ${taskData.getXP()} xp`;
        tasksWrapper.classList.add(`${taskData.priority}`);
        task.dataset.id = taskData.id;

        const { currentTasksArr } = this.stateManager.uiState;

        if (currentTasksArr === 'completedTasks') {
            task.classList.add('complete');
            task.querySelector('button[data-id="completeTask"]')?.remove();
        }
        return task;
    }

    #createProjectElement([projectId, projectData]) {
        const {
            projectCard,
            projectIcon,
            projectName,
            projectCardBtn,
            projectCardBtnIcon
        } = this.#parseProjectStructure();

        const { currentProjectId } = this.stateManager.uiState;

        if (projectId === currentProjectId) {
            projectCardBtn.classList.add('hide');
            projectCard.classList.add('active');
        }

        const contrastColor = getContrastColor(projectData.color);

        projectCardBtnIcon.style.fill = contrastColor;
        projectCard.dataset.id = projectId;
        projectCard.style.background = `
            linear-gradient(${projectData.color}, ${projectData.color}80)`;
        projectCard.style.color = contrastColor;
        projectName.textContent = projectData.title;
        projectIcon.style.fill = contrastColor;

        return projectCard;
    }

    #createFormElement(formId, taskId = null) {
        const form = createElement(this.taskFormStructure);
        form.dataset.id = formId;
        if(taskId) {
            form.dataset.taskId = taskId;
        }
        return form;
    }

    renderForm = (popupContainer, formId = 'task', taskId = null) => {
        const fragment = document.createDocumentFragment();
        fragment.appendChild(this.#createFormElement(formId, taskId));
        popupContainer.replaceChildren(fragment);
    }

    renderTasks = () => {

        const { currentProjectId } = this.stateManager.uiState;
        const project = this.stateManager.projects[currentProjectId];
        this.ui.projectTitle.textContent = project.title;

        const fragment = document.createDocumentFragment();
        const tasksToShow = this.#getProcessedTasks();

        tasksToShow.forEach(taskData => {
            fragment.appendChild(this.#createTaskElement(taskData));
        });
        this.tasksContainer.replaceChildren(fragment);
    }

    renderProjects = () => {
        const fragment = document.createDocumentFragment();
        const projects = Object.entries(this.stateManager.projects);

        projects.forEach(project => {
            fragment.appendChild(this.#createProjectElement(project));
        });
        this.projectsContainer.replaceChildren(fragment);
    }

    renderLevel = () => {
        const { currentUserId } = this.stateManager.uiState;

        const { totalXP, rank, level } = this.stateManager.users[currentUserId];

        this.ui.levelBar.style.width = `${calculateProgress(totalXP, level)}%`;
        this.ui.spanLevel.textContent = level;
        this.ui.spanRank.textContent = rank;
        this.ui.spanXp.textContent = totalXP;
    }

    render = () => {
        this.renderProjects();
        this.renderTasks();
        this.renderLevel();
    }

    #cleanColorOutput = () => {
        const styles = getComputedStyle(document.documentElement);
        const initialColor = styles.getPropertyValue('--primary-amber-color');
        document.documentElement.style.setProperty('--user-input-color', initialColor);
        this.ui.popupOutput.textContent = 'Your color';
    }

    hidePopup = (popupOverlay) => {
        const popupInputs = popupOverlay.querySelectorAll('.popup__input');

        popupInputs.forEach(input => {
            input.required = false;
            input.value = '';
            this.#cleanColorOutput();
        });
        popupOverlay.classList.add('close');
    }

    #prepopulatePopup(taskId) {
        const { currentProjectId, currentTasksArr } = this.stateManager.uiState;
        const tasks = this.stateManager.projects[currentProjectId][currentTasksArr];
        const taskData = Object.entries(tasks.find(task => task.id === taskId));

        taskData.forEach(([key, value]) => {
            if (key === 'dueDate') {
                key = 'date';
            } else if (key === 'id') {
                return;
            }
            document.querySelector(`#${key}`).value = value;
        });
    }

    showPopup = (type, taskId) => {
        const popupOverlay = document.querySelector(type);
        const popupContainer = popupOverlay.querySelector('.popup__container');
        const formId = taskId ? 'taskEdit' : 'task';

        this.renderForm(popupContainer, formId, taskId);
        if (taskId) {
            this.#prepopulatePopup(taskId);
        }

        popupOverlay.classList.remove('close');
    }

    animateCardRemoval = (card, className) => {
        card.classList.add(className);
        setTimeout(() => {
            card.remove();
        }, 400);
    }

    showColorInput = (output, colorValue) => {
        output.textContent = colorValue;
        document.documentElement.style.setProperty('--user-input-color', colorValue);
    }

    #updateTasksArr(tabName) {
        const newTaskArr = tabName === 'openActive' ? 'activeTasks' :
            'completedTasks';
        this.stateManager.setUIState('currentTasksArr', newTaskArr);
    }

    #hideAddTaskBtn = (tabType) => {
        if (tabType === 'openCompleted') {
            this.ui.addTaskBtn.classList.add('disable');
        } else {
            this.ui.addTaskBtn.classList.remove('disable');
        }
    }

    openTab = (tabType) => {
        this.ui.tabs.forEach(tab => tab.checked = false);
        document.querySelector(`[data-tab-type=${tabType}]`).checked = true;
        this.#updateTasksArr(tabType);

        this.#hideAddTaskBtn(tabType);
        this.renderTasks();
    }
}