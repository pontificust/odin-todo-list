import { createElement } from "./createElement.js";
import { getContrastColor, calculateProgress } from "../utils.js";

export class RenderManger {

    filters = {
        'priority': (project, priorityType) => this.filterPriority(project,
            priorityType),
        'overdue': (project) => this.filterOverdue(project),
        'upcoming': (project) => this.filterUpcoming(project),
        'filterOff': () => this.renderTasks(),
    }

    sorts = {
        'priority': (project) => this.sortPriority(project),
        'reverse': (project) => this.sortOverdue(project),
        'chronological': (project) => this.sortUpcoming(project),
        'sortOff': () => this.renderTasks(),
    }

    filterTypes = {
        'critical': 'priority',
        'moderate': 'priority',
        'low': 'priority',
        'overdue': 'overdue',
        'upcoming': 'upcoming',
        'filterOff': 'filterOff'
    }

    constructor(
        tasksContainer,
        projectsContainer,
        taskStructure,
        projectStructure,
        stateManager

    ) {
        this.tasksContainer = document.querySelector(tasksContainer);
        this.projectsContainer = document.querySelector(projectsContainer);
        this.taskStructure = taskStructure;
        this.projectStructure = projectStructure;
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
        this.currentUserId = Object.keys(stateManager.users)[0];
        this.currentProjectId = 'default';
        this.currentTasksArr = 'activeTasks'
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

        taskName.textContent = taskData.title;
        taskPriority.textContent = `[${taskData.priority}]`;
        taskPriority.classList.add(`${taskData.priority}`);
        taskDate.textContent = `due ${taskData.dueDate}`;
        taskXp.textContent = `+ ${taskData.getXP()} xp`;
        tasksWrapper.classList.add(`${taskData.priority}`);
        task.dataset.id = taskData.id;

        if (this.currentTasksArr === 'completedTasks') {
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

        if (project[0] === this.currentProjectId) {
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

    renderTasks = (customProject = null) => {
        const project = customProject || this.stateManager.projects[this.currentProjectId];
        this.ui.projectTitle.textContent = project.title;

        const fragment = document.createDocumentFragment();
        const tasksToShow = project[`${this.currentTasksArr}`];
        console.log(tasksToShow)

        tasksToShow.forEach(taskData => {
            fragment.appendChild(this.#createTaskElement(taskData));
        });
        this.tasksContainer.replaceChildren(fragment);
    }

    renderProjects = () => {
        const fragment = document.createDocumentFragment();
        const projects = Object.entries(this.stateManager.projects);

        projects.forEach(project => {
            console.log(project)
            fragment.appendChild(this.#createProjectElement(project));
        });
        this.projectsContainer.replaceChildren(fragment);
    }

    renderLevel = () => {
        const { totalXP, rank, level } = this.stateManager.users[this.currentUserId];

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

    showPopup = (type) => {
        const popupOverlay = document.querySelector(type);
        const popupInputs = popupOverlay.querySelectorAll('.popup__input');

        popupInputs.forEach(input => input.required = true);
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
        this.currentTasksArr = tabName === 'openActive' ? 'activeTasks' :
            'completedTasks';
    }

    #hideAddTaskBtn = (tabType) => {
        if (tabType === 'openCompleted') {
            this.ui.addTaskBtn.classList.add('hide');
        } else {
            this.ui.addTaskBtn.classList.remove('hide');
        }
    }

    openTab = (tabType) => {
        console.log(tabType)
        this.ui.tabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-tab-type=${tabType}]`).classList.add('active');
        console.log(document.querySelector(`[data-tab-type=${tabType}]`))
        this.#updateTasksArr(tabType);
        console.log(this.currentTasksArr)

        this.#hideAddTaskBtn(tabType);
        this.renderTasks();
    }

    #renderFilteredTasks(project, filteredTasks) {
        let filteredProject = { ...project };
        filteredProject[this.currentTasksArr] = filteredTasks;
        this.renderTasks(filteredProject);
    }

    filterPriority = (project, priorityType) => {
        const filteredTasks = project[this.currentTasksArr].filter(task => {
            return task.priority === priorityType;
        });
        console.log(priorityType)
        this.#renderFilteredTasks(project, filteredTasks);
    }

    filterOverdue = (project) => {
        const currentDate = Date.now().setHours(0, 0, 0, 0);
        const filteredTasks = project[this.currentTasksArr].filter(task => {
            const taskDate = new Date(task.dueDate).getTime();
            return taskDate < currentDate;
        });
        this.#renderFilteredTasks(project, filteredTasks);
    }

    filterUpcoming = (project) => {
        const currentDate = Date.now().setHours(0, 0, 0, 0);
        const filteredTasks = project[this.currentTasksArr].filter(task => {
            const taskDate = new Date(task.dueDate).getTime();
            return taskDate > currentDate;
        });
        this.#renderFilteredTasks(project, filteredTasks);
    }


    filterTasks = (e) => {
        const filterName = e.target.value;
        const filterType = this.filterTypes[filterName];
        const project = this.stateManager.projects[this.currentProjectId];
        console.log(filterType)

        this.filters[filterType].call(this, project, filterName);
    }

    sortPriority = (project) => {
        const filteredTasks = project[this.currentTasksArr].toSorted((task1, task2) => {
            return task1.getXP() - task2.getXP();
        });
        this.#renderFilteredTasks(project, filteredTasks);
    }

    sortOverdue = (project) => {
        const filteredTasks = project[this.currentTasksArr].toSorted((task1, task2) => {
            const taskDate1 = new Date(task1.dueDate).getTime();
            const taskDate2 = new Date(task2.dueDate).getTime();
            return taskDate2 - taskDate1;
        });
        console.log(filteredTasks)
        this.#renderFilteredTasks(project, filteredTasks);
    }

    sortUpcoming = (project) => {
        const filteredTasks = project[this.currentTasksArr].toSorted((task1, task2) => {
            const taskDate1 = new Date(task1.dueDate).getTime();
            const taskDate2 = new Date(task2.dueDate).getTime();
            return taskDate1 - taskDate2;
        });
        this.#renderFilteredTasks(project, filteredTasks);
    }


    sortTasks = (e) => {
        const sortName = e.target.value;
        const project = this.stateManager.projects[this.currentProjectId];
        console.log(sortName)

        this.sorts[sortName].call(this, project);
    }
}