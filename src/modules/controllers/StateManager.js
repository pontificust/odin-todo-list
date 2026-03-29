import { Task } from "../models/Task.js";
import { Project } from "../models/Project.js";
import { User } from "../models/User.js";

export class StateManager {
    projects = {}
    users = {}
    
    constructor() {
        this.projects = {};
        this.users = {};

        this.uiState = {
            currentUserId: 'defaultUser',
            currentProjectId: 'defaultProject',
            currentTasksArr: 'activeTasks',
            activeFilter: 'filterOff',
            activeSort: 'sortOff',
        }
    }

    setUIState(key, value) {
        this.uiState[key] = value;
    }
    
    #notify( detail = null) {
       const event = new CustomEvent('updateStorage', { detail });
        document.dispatchEvent(event);
    }

    loadProjects(data) {
        this.projects = data[0];
        this.users = data[1];
        this.#hydrate();
    }

    #hydrate() {
        this.projects = Object.fromEntries(
            Object.entries(this.projects).map(project => {
            const hydratedProject = new Project(project[1]);
            console.log(project[1].activeTasks)
            hydratedProject.activeTasks = project[1].activeTasks.map(task => 
                new Task(task));
            hydratedProject.completedTasks = project[1].completedTasks.map(task => new Task(task));
            return [hydratedProject.id, hydratedProject];
        }));
        this.users = Object.fromEntries(
            Object.entries(this.users).map( user => {
                const hydratedUser = new User(user[1]);
                return [hydratedUser.id, hydratedUser];
            })
        );
    }

    #isProjectExist(title) {
        return Object.values(this.projects).some(project => 
            project.title === title);
    }

    addUser = (user) => {
        this.users[user.id] = user;
    }

    addProject = ({title, color, activeTasks, completedTasks, id}) => {
        if (this.#isProjectExist(title)) {
            return;
        }

        const newProject = new Project({ 
            title, color, activeTasks, completedTasks, id 
        });
        console.log(newProject)
        this.projects[newProject.id] = newProject;
        this.#notify();
    }

    addTask = (taskData, currentProjectId) => {
        const newTask = new Task(taskData);
        this.projects[currentProjectId].addTask(newTask);
        this.#notify();
    }

    removeTask = (taskId, currentProjectId, tabName) => {
        this.projects[currentProjectId].removeTask(taskId, tabName);
        this.#notify();
    }

    completeTask(taskId, currentProjectId, currentUserId) {
        const task = this.projects[currentProjectId].completeTask(taskId);

        this.users[currentUserId].addXP(task.getXP());
        this.#notify();
    }

    removeProject = (projectId) => {
        
        delete this.projects[projectId];
        this.#notify();
    }
}