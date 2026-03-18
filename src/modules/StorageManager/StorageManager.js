export class StorageManager {
    constructor() {
        this.localStorage = window.localStorage;
    }

    isEmpty() {
        return this.localStorage.length === 0;
    }

    updateStorage = (projects) => {
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    getDataset(datasetTitle) {
        const dataset = JSON.parse(this.localStorage.getItem(datasetTitle));
        return dataset;
    }
}