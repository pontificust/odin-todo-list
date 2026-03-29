import { Task } from "../models/Task.js";

const tasks = [
    new Task({
        title: 'Buy groceries',
        description: 'Milk, eggs, bread, and coffee',
        dueDate: '2023-11-25',
        priority: 'critical'
    }),
    new Task({
        title: 'Clean the kitchen',
        description: 'Mop the floor and wipe counters',
        dueDate: '2023-11-26',
        priority: 'moderate'
    }),
    new Task({
        title: 'Read 20 pages',
        description: 'Continue reading "Clean Code"',
        dueDate: '2023-11-24',
        priority: 'low'
    }),
    new Task({
        title: 'Finish project report',
        description: 'Complete the final summary for the client',
        dueDate: '2023-11-23',
        priority: 'critical'
    })
];

export const projects = [
    {
        title: 'home',
        color: '#696969',
        activeTasks: [tasks[1], tasks[2]],
        completedTasks: [tasks[3], tasks[0]],
        id: 'defaultProject',
    },
    {
        title: 'Work',
        color: '#33c1ff',
        activeTasks: [tasks[3], tasks[0]],
        completedTasks: [tasks[1], tasks[2]]
    },
    {
        title: 'Fitness',
        color: '#44ff33',
        activeTasks: tasks,
        completedTasks: []
    }
];
