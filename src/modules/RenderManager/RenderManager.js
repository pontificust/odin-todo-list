import { Element } from "../Element/Element.js";
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
        const projectName = projectCard.querySelector('.aside__menu-name');
        const projectCardBtn = projectCard.querySelector('button');

        return { projectCard, projectName, projectCardBtn };
    }

    renderTasks = () => {
        this.tasksContainer.innerHTML = '';

        const tasks = this.stateManager.projects[this.currentProjectId].tasks;
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
            taskXp.textContent = `+ ${tasks[j].getXp()} xp`;
            tasksWrapper.classList.add(`${priority}`);
            task.dataset.id = id;
            this.tasksContainer.appendChild(task);
        }
    }

    rednerProjects = () => {
        this.projectsContainer.innerHTML = '';

        for(let project of Object.entries(this.stateManager.projects)) {
            const { 
                projectCard,
                projectName,
                projectCardBtn
            } = this.#parseProjectStructure();

            if(project[0] === 'default') {
                projectCardBtn.remove();
            }

            projectCard.dataset.id = project[0];
            projectCard.style.backgroundColor = project[1].color;
            projectName.textContent = project[1].title;
            this.projectsContainer.appendChild(projectCard);
        }
    }

    render = () => {
        this.rednerProjects();
        this.renderTasks();
    }

    #cleanColorOutput = () => {
        const popupOutput = document.querySelector('.popup__output');
        popupOutput.textContent = 'Your color';
        popupOutput.style.borderColor = '';

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

    closeTask = (e, stateManager) => {
        const taskCard = e.target.closest('.tasks__card');
        stateManager.removeTask(taskCard.dataset.id, 'home');
        taskCard.remove();
    }

    closeProject = (e, stateManager) => {
        const projectCard = e.target.closest('.aside__menu-project');
        if('default' === projectCard.dataset.id) {
            return;
        }
        stateManager.removeProject(projectCard.dataset.id);
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
        output.style.borderColor = color;
    }

    openProject = (e) => {
        this.currentProjectId = e.target.closest('li').dataset.id;

        this.renderTasks();
    }

}