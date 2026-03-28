import { createElement } from "./createElement.js";
import { getContrastColor, calculateProgress} from "../utils.js";

export class RenderManger {
    currentProjectId = 'default';
    currentTasksArr = 'activeTasks'
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
        this.currentPlayerId = Object.keys(stateManager.users)[0];
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


    renderTasks = (project) => {
        this.tasksContainer.innerHTML = '';
        const projectTitle = document.querySelector('.tasks__sector-title');
        if (!project) {
            project = this.stateManager.projects[this.currentProjectId];
        }
        console.log(project)
        projectTitle.textContent = project.title;

        const tasks = project[`${this.currentTasksArr}`];
        for (let j = 0; j < tasks.length; j += 1) {
            const {
                task,
                taskName,
                taskPriority,
                taskDate,
                taskXp,
                tasksWrapper } = this.#parseTaskStructure();
            const priority = tasks[j].priority;
            const id = tasks[j].id;

            taskName.textContent = tasks[j].title;
            taskPriority.textContent = `[${priority}]`;
            taskPriority.classList.add(`${priority}`);
            taskDate.textContent = `due ${tasks[j].dueDate}`;
            taskXp.textContent = `+ ${tasks[j].getXP()} xp`;
            tasksWrapper.classList.add(`${priority}`);
            task.dataset.id = id;
            if (this.currentTasksArr === 'completedTasks') {
                task.classList.add('complete');
                task.querySelector('button[data-id="completeTask"]').remove();
            }
            this.tasksContainer.appendChild(task);
        }
    }

    renderProjects = () => {
        this.projectsContainer.innerHTML = '';

        for (let project of Object.entries(this.stateManager.projects)) {
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

            const contrastColor = getContrastColor(project[1].color);

            projectCardBtnIcon.style.fill = contrastColor;
            projectCard.dataset.id = project[0];
            projectCard.style.background = `
            linear-gradient(${project[1].color}, ${project[1].color}80)`;
            projectCard.style.color = contrastColor;
            projectName.textContent = project[1].title;
            projectIcon.style.fill = contrastColor;
            this.projectsContainer.appendChild(projectCard);
        }
    }

    renderLevel = () => {
        const levelBar = document.querySelector('.header__user-bar');
        const spanLevel = document.querySelector('[data-id="level"]');
        const spanRank = document.querySelector('[data-id="rank"]');
        const spanXp = document.querySelector('[data-id="xp"]');
        const { totalXP, rank, level } = this.stateManager.users[this.currentPlayerId];

        levelBar.style.width = `${calculateProgress(totalXP, level)}%`;
        spanLevel.textContent = level;
        spanRank.textContent = rank;
        spanXp.textContent = totalXP;
    }

    render = () => {
        this.renderProjects();
        this.renderTasks();
        this.renderLevel();
    }

    #cleanColorOutput = () => {
        const popupOutput = document.querySelector('.popup__output');
        const styles = getComputedStyle(document.documentElement);
        const initialColor = styles.getPropertyValue('--primary-amber-color');
        document.documentElement.style.setProperty('--user-input-color', initialColor);
        popupOutput.textContent = 'Your color';
    }

    closePopup = (e) => {
        const popupOverlay = e.target.closest('.overlay');
        const popupInputs = popupOverlay.querySelectorAll('.popup__input');

        popupInputs.forEach(input => {
            input.required = false;
            input.value = '';
            this.#cleanColorOutput();
        });
        popupOverlay.classList.add('close');
    }

    openPopup = (e) => {
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

    closeTask = (e) => {
        const taskCard = e.target.closest('.tasks__card');
        if (taskCard.classList.contains('complete')) {
            this.currentTasksArr = 'completedTasks';
        }
        this.stateManager.removeTask(
            taskCard.dataset.id,
            this.currentProjectId,
            this.currentTasksArr
        );
        taskCard.classList.add('hide');
        setTimeout(() => {
            taskCard.remove();
        }, 400);
    }

    moveTaskToCompleted = (e) => {
        const taskCard = e.target.closest('.tasks__card');
        this.stateManager.completeTask(
            taskCard.dataset.id,
            this.currentProjectId,
            this.currentPlayerId
        );
        taskCard.remove();
        this.renderLevel();
    }

    closeProject = (e) => {
        const projectCard = e.target.closest('.aside__menu-project');
        if ('default' === projectCard.dataset.id) {
            return;
        }
        this.currentProjectId = 'default';
        this.stateManager.removeProject(projectCard.dataset.id);
        projectCard.classList.add('hide');
        setTimeout(() => {
            projectCard.remove();
        }, 400);
    }

    #updateOutput(e) {
        const output = e.target.nextElementSibling;
        output.textContent = e.target.value;
        return output;
    }

    showColorInput = (e) => {
        const output = this.#updateOutput(e);
        const color = output.textContent;
        document.documentElement.style.setProperty('--user-input-color', color);
    }

    openProject = (e) => {
        const prevProjectCard = document.querySelector(`[data-id="${this.currentProjectId}"]`);
        prevProjectCard.classList.remove('active');

        this.currentProjectId = e.target.closest('li').dataset.id;
        const projectCard = document.querySelector(`[data-id="${this.currentProjectId}"]`);
        projectCard.classList.add('active');

        this.openTab();
    }

    #updateTasksArr(tabName) {
        this.currentTasksArr = tabName === 'openActive' ? 'activeTasks' :
            'completedTasks';
    }

    openTab = (e) => {
        const tabs = document.querySelectorAll('.tasks__tab');
        const addButton = document.querySelector('.tasks__btn');
        tabs.forEach(tab => tab.classList.remove('active'));
        if (e) {
            e.target.classList.add('active');
            this.#updateTasksArr(e.target.dataset.id);
        } else {
            document.querySelector('[data-id="openActive"]').classList.add('active');
        }

        if (this.currentTasksArr === 'completedTasks') {

            addButton.classList.add('hide');
        } else {
            addButton.classList.remove('hide');
        }
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