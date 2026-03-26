import { createElement } from "../createElement.js/createElement.js";

export class RenderManger {
    currentProjectId = 'default';

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

    #getContrastColor(hexColor) {
        const hex = hexColor.replace('#', '');

        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);

        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

        return (yiq >= 128) ? '#000000' : '#ffffff';
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


    renderTasks = (tabName = "activeTasks") => {
        this.tasksContainer.innerHTML = '';
        const projectTitle = document.querySelector('.tasks__sector-title');
        const project = this.stateManager.projects[this.currentProjectId];
        projectTitle.textContent = project.title;

        const tasks = project[`${tabName}`];
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
            if (tabName === 'completedTasks') {
                task.classList.add('complete');
                task.querySelector('button[data-id="completeTask"]').remove();
            }
            this.tasksContainer.appendChild(task);
        }
    }

    rednerProjects = () => {
        this.projectsContainer.innerHTML = '';

        for (let project of Object.entries(this.stateManager.projects)) {
            const {
                projectCard,
                projectIcon,
                projectName,
                projectCardBtn,
                projectCardBtnIcon
            } = this.#parseProjectStructure();

            if (project[0] === 'default') {
                projectCardBtn.remove();
                projectCard.classList.add('active');
            }

            const contrastColor = this.#getContrastColor(project[1].color);

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
        let newWidth = (totalXP / 1000) * 100 - (+level - 1) * 100;
        if (newWidth >= 100) {
            newWidth = newWidth - 100;
        }

        levelBar.style.width = `${newWidth}%`;
        spanLevel.textContent = level;
        spanRank.textContent = rank;
        spanXp.textContent = totalXP;
    }

    render = () => {
        this.rednerProjects();
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
        let tabName = 'activeTasks';
        if (taskCard.classList.contains('complete')) {
            tabName = 'completedTasks';
        }
        this.stateManager.removeTask(taskCard.dataset.id, this.currentProjectId, tabName);
        taskCard.remove();
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
        projectCard.remove();
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

    openTab = (e) => {
        const tabs = document.querySelectorAll('.tasks__tab');
        const addButton = document.querySelector('.tasks__btn');
        tabs.forEach(tab => tab.classList.remove('active'));
        let tabName = 'activeTasks';
        if (e) {
            e.target.classList.add('active');
            tabName = e.target.dataset.id === 'openActive' ? 'activeTasks' :
                'completedTasks';
        } else {
            document.querySelector('[data-id="openActive"]').classList.add('active');
        }

        if (tabName === 'completedTasks') {

            addButton.classList.add('hide');
        } else {
            addButton.classList.remove('hide');
        }
        this.renderTasks(tabName);
    }
}