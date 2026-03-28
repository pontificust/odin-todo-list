import { getFormData  } from "../utils.js";

export class EventHandler {
    constructor(
        stateManager,
        renderManager,
        storageManager,
    ) {
        this.click = {
            'closePopup': (e) => renderManager.closePopup(e),
            'openPopup': (e) => renderManager.openPopup(e),
            'closeTask': (e) => renderManager.closeTask(e),
            'closeProject': (e) => renderManager.closeProject(e),
            'openProject': (e) => renderManager.openProject(e),
            'openProjectPopup': (e) => renderManager.openPopup(e),
            'openActive': (e) => renderManager.openTab(e),
            'openCompleted': (e) => renderManager.openTab(e),
            'completeTask': (e) => renderManager.moveTaskToCompleted(e),
        };
        this.submit = {
            'project': (e) => {
                const projectData = getFormData(e);
                stateManager.addProject(projectData);
                renderManager.closePopup(e);
            },
            'task': (e) => {
                const taskData = getFormData(e);

                stateManager.addTask(taskData, renderManager.currentProjectId);
                renderManager.closePopup(e);
            },
        };
        this.input = {
            'color': (e) => renderManager.showColorInput(e),
            'filter': (e) => renderManager.filterTasks(e),
            'sort': (e) => renderManager.sortTasks(e),
        };
        this.updateStorage = (e, projects, users) => {
            storageManager.updateStorage(projects, users);
            renderManager.render();
        };
    }
}