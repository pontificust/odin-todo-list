export class EventHandler {
    constructor(
        addProject,
        addTask,
        updateStorage,
        addXP,
        render,
        closePopup,
        openPopup,
        closeTask,
        showColorInput
    ) {
        this.click = {
            'closePopup': (e) => closePopup(e),
            'openPopup': (e) => openPopup(e),
            'closeTask': (e) => closeTask(e),
            'openProjectPopup': (e) => openPopup(e),
        };
        this.submit = {
            'project': (e) => {
                e.preventDefault();
                const projectData = Object.fromEntries(new FormData(e.target));
                addProject(projectData);
                closePopup(e);
            },
            'task': (e) => {
                e.preventDefault();
                const taskData = Object.fromEntries(new FormData(e.target));

                addTask(taskData);
                closePopup(e);
            },
        };
        this.input = {
            'color': (e) => showColorInput(e),
        };
        this.updateStorage = (projects) => {
            updateStorage(projects);
            render(projects);
        };
        this.taskFinished = (e) => {
            addXP(e.xp);
        };
    }
}