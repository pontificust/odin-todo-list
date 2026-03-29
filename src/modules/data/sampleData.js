import { Task } from "../models/Task.js";

const tasks = [
    new Task({
        title: 'Secure Purified Water',
        description: 'Scavenge for un-irradiated water or repair the filtration unit.',
        dueDate: '2023-11-25',
        priority: 'critical'
    }),
    new Task({
        title: 'Clear Radroach Infestation',
        description: 'Exterminate the pests in the lower maintenance tunnels.',
        dueDate: '2023-11-26',
        priority: 'moderate'
    }),
    new Task({
        title: 'Study Technical Manuals',
        description: 'Review pre-war schematics to increase Science and Repair skills.',
        dueDate: '2023-11-24',
        priority: 'low'
    }),
    new Task({
        title: 'Update Overseer Logs',
        description: 'Compile the weekly settlement survival statistics for the vault record.',
        dueDate: '2023-11-23',
        priority: 'critical'
    }),
    new Task({
        title: 'Scout Glowing Sea',
        description: 'Monitor radiation levels at the settlement perimeter.',
        dueDate: '2023-11-28',
        priority: 'moderate'
    }),
    new Task({
        title: 'Calibrate Power Armor',
        description: 'Perform a full diagnostic on the T-51 hydraulic joints.',
        dueDate: '2023-11-30',
        priority: 'low'
    })
];

export const projects = [
    {
        title: 'Vault Quarters',
        color: '#696969',
        activeTasks: [tasks[1], tasks[2]],
        completedTasks: [tasks[3]],
        id: 'defaultProject',
    },
    {
        title: 'Brotherhood Ops',
        color: '#33c1ff',
        activeTasks: [tasks[3], tasks[5]],
        completedTasks: [tasks[0]]
    },
    {
        title: 'Wasteland Survival',
        color: '#44ff33',
        activeTasks: [tasks[0], tasks[4]],
        completedTasks: [tasks[1], tasks[2]]
    }
];