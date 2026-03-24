export class EventHandler {
    constructor(
        stateManager,
        renderManager,
        user,
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
                e.preventDefault();
                const projectData = Object.fromEntries(new FormData(e.target));
                stateManager.addProject(projectData);
                renderManager.closePopup(e);
            },
            'task': (e) => {
                e.preventDefault();
                const taskData = Object.fromEntries(new FormData(e.target));

                stateManager.addTask(taskData, renderManager.currentProjectId);
                renderManager.closePopup(e);
            },
        };
        this.input = {
            'color': (e) => renderManager.showColorInput(e),
        };
        this.updateStorage = (projects) => {
            storageManager.updateStorage(projects);
            renderManager.render(projects);
        };
        this.taskFinished = (e) => {
            user.addXP(e.xp);
        };
    }
}