export class StorageManager {
    constructor() {
        this.localStorage = window.localStorage;
    }

    isEmpty() {
        return this.localStorage.length === 0;
    }

    updateStorage = (projects, users) => {
        this.localStorage.setItem('projects', JSON.stringify(projects));
        this.localStorage.setItem('users', JSON.stringify(users));
    }

    getDataset(...datasetTitles) {
        const dataset = datasetTitles.map( title => 
            JSON.parse(this.localStorage.getItem(title)));
        return dataset;
    }
}