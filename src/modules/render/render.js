import { Element } from "../Element/Element.js";
import { createElement } from "../createElement.js/createElement.js";

export const render = (projects) => {
    for (let i = 0; i < projects.length; i += 1) {
        console.log(`${i}. ${projects[i].title}`);
        const tasks = projects[i].tasks;
        for (let j = 0; j < tasks.length; j += 1) {
            console.log(`${j}. ${tasks[j].title}`);
        }
    }
    console.log(projects)
}