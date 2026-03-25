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
            'completeTask': (e) => {
                renderManager.moveTaskToCompleted(e);
                renderManager.renderLevel();
            },
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
        this.updateStorage = (e, projects, users) => {
            storageManager.updateStorage(projects, users);
            if (e.detail) {
                console.log(e.detail.tabName)
                renderManager.renderTasks(e.detail.tabName);
                return;
            }
            renderManager.renderTasks();
        };
        this.taskFinished = (xp) => {
            // user.addXP(xp);
            // renderManager.updateLevel(user.totalXP, user.level, user.rank);
        };
    }
}