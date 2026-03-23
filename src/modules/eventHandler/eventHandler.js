export class EventHandler {
    constructor(
        addProject,
        addTask,
        updateStorage,
        addXP,
        render,
        closePopup,
        openPopup,
        closeTask
    ) {
        this.click = {
            'closePopup': () => closePopup(),
            'openPopup': () => openPopup(),
            'closeTask': (e) => closeTask(e),
        };
        this.submit = {
            'project': (e) => addProject(e),
            'task': (e) => {
                e.preventDefault();
                const { title, description, dueDate, priority } = Object.fromEntries(new FormData(e.target));

                addTask(title, description, dueDate, priority);
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