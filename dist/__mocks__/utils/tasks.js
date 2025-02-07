/**
 * @public
 */
export class Tasks {
    constructor() {
        this.tasks = [];
    }
    /**
     * @public
     */
    add(callback) {
        this.tasks.push(callback());
    }
    /**
     * @public
     */
    addPromise(promise) {
        this.tasks.push(promise);
    }
    /**
     * @public
     */
    isEmpty() {
        return this.tasks.length === 0;
    }
    /**
     * @public
     */
    promise() {
        return Promise.all(this.tasks);
    }
}
