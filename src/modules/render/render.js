import { Element } from "../Element/Element.js";
import { createElement } from "../createElement.js/createElement.js";
import checkIcon from "./check.svg";
import deleteIcon from "./delete.svg";

export const render = (projects) => {
    const tasksContainer = document.querySelector('.tasks__cards');
    // tasksContainer.innerHTML = '';

    // const taskStructure  = new Element('li', [
    //         new Element('div', [
    //             new Element('div', [
    //                 new Element('h3', '', { className: 'tasks__name'}),
    //                 new Element('p', '', { className: 'tasks__priority'}),
    //             ], { className: 'tasks__card-row' }),
    //             new Element('div', [
    //                 new Element('p', '', { className: 'tasks__date'}),
    //                 new Element('p', '', { className: 'tasks__xp'}),
    //             ], { className: 'tasks__card-row' }),
    //         ], { className: 'tasks__card-wrapper' }),
    //         new Element('div', [
    //             new Element('button', [
    //                 new Element('img', '', { className: 'tasks__card-icon', src: checkIcon, alt: 'check icon'})
    //             ], { className: 'tasks__card-btn' }),
    //             new Element('button', [
    //                 new Element('img', '', { className: 'tasks__card-icon', src: deleteIcon, alt: 'trash bin icon'})
    //             ], { className: 'tasks__card-btn'}),
    //         ], { className: 'tasks__card__btns' }),
    //     ], { className: 'tasks__card' });

    // console.log(createElement(taskStructure).querySelector('div'))

        
    //     console.log(`${0}. ${projects[0].title}`);
    //     const tasks = projects[0].tasks;
    //     for (let j = 0; j < tasks.length; j += 1) {
    //         const task = createElement(taskStructure);
    //         const taskName = task.querySelector('.tasks__name');
    //         const taskPriority = task.querySelector('.tasks__priority');
    //         const taskDate = task.querySelector('.tasks__date');
    //         const taskXp = task.querySelector('.tasks__xp');
    //         const tasksWrapper = task.querySelector('.tasks__card-wrapper');
    //         const priority = tasks[j].priority;
    
    //         taskName.textContent = tasks[j].title;
    //         taskPriority.textContent = `[${priority}]`;
    //         taskPriority.classList.add(`${priority}`);
    //         taskDate.textContent = `due ${tasks[j].dueDate}`;
    //         taskXp.textContent = `+ ${tasks[j].getXp()} xp`;
    //         tasksWrapper.classList.add(`${priority}`);
    //         console.log(`${j}. ${tasks[j].title}`);
    //         tasksContainer.appendChild(task);
    //     }
    console.log(projects)
}