import { vi } from 'vitest';

/**
 * @public
 */
export class Tasks {
    private tasks: Promise<any>[] = [];

    /**
     * @public
     */
    add(callback: () => Promise<any>): void {
        this.tasks.push(callback());
    }

    /**
     * @public
     */
    addPromise(promise: Promise<any>): void {
        this.tasks.push(promise);
    }

    /**
     * @public
     */
    isEmpty(): boolean {
        return this.tasks.length === 0;
    }

    /**
     * @public
     */
    promise(): Promise<any> {
        return Promise.all(this.tasks);
    }
} 