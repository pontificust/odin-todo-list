import { Element } from "../Element/Element.js";
import { createElement } from "../createElement.js/createElement.js";
import checkIcon from "./check.svg";
import deleteIcon from "./delete.svg";

export const render = (projects) => {
    const tasksContainer = document.querySelector('.tasks__cards');
    tasksContainer.innerHTML = '';

    const taskStructure  = new Element('li', [
            new Element('div', [
                new Element('div', [
                    new Element('h3', '', { className: 'tasks__name'}),
                    new Element('p', '', { className: 'tasks__priority'}),
                ], { className: 'tasks__card-row' }),
                new Element('div', [
                    new Element('p', '', { className: 'tasks__date'}),
                    new Element('p', '', { className: 'tasks__xp'}),
                ], { className: 'tasks__card-row' }),
            ], { className: 'tasks__card-wrapper' }),
            new Element('div', [
                new Element('button', '', { className: 'tasks__card-btn button', 'data-id':"complete" }),
                new Element('button', '', { className: 'tasks__card-btn button', 'data-id': "closeTask"}),
            ], { className: 'tasks__card-btns' }),
        ], { className: 'tasks__card' });

    console.log(createElement(taskStructure).querySelector('div'))

        
        const tasks = projects[Object.keys(projects)[0]].tasks;
        for (let j = 0; j < tasks.length; j += 1) {
            const task = createElement(taskStructure);
            const taskName = task.querySelector('.tasks__name');
            const taskPriority = task.querySelector('.tasks__priority');
            const taskDate = task.querySelector('.tasks__date');
            const taskXp = task.querySelector('.tasks__xp');
            const tasksWrapper = task.querySelector('.tasks__card-wrapper');
            const priority = tasks[j].priority;
            const id = tasks[j].id;
    
            taskName.textContent = tasks[j].title;
            taskPriority.textContent = `[${priority}]`;
            taskPriority.classList.add(`${priority}`);
            taskDate.textContent = `due ${tasks[j].dueDate}`;
            taskXp.textContent = `+ ${tasks[j].getXp()} xp`;
            tasksWrapper.classList.add(`${priority}`);
            console.log(`${j}. ${tasks[j].title}`);
            task.dataset.id = id;
            tasksContainer.appendChild(task);
        }
    console.log(projects)
}