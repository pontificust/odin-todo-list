export class EventHandler {
    constructor(
        addProject,
        addTask,
        updateStorage, 
        addXP, 
        render,
        closePopup,
        openPopup
    ) {
        this.click = {
            'closePopup': () => closePopup(),
            'openPopup': () => openPopup(),
        };
        this.submit = {
            'project': (e) => addProject(e),
            'task': (e) => {
                addTask(e);
                closePopup();
            },
        }
        this.updateStorage = (projects) => {
            updateStorage(projects);
            render(projects);
        };
        this.taskFinished = (e) => {
            addXP(e.xp);
        };
    }
}