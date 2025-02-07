/**
 * @public
 */
export declare class Tasks {
    private tasks;
    /**
     * @public
     */
    add(callback: () => Promise<any>): void;
    /**
     * @public
     */
    addPromise(promise: Promise<any>): void;
    /**
     * @public
     */
    isEmpty(): boolean;
    /**
     * @public
     */
    promise(): Promise<any>;
}
