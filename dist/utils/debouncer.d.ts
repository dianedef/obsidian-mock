export declare class Debouncer<Args extends any[], ReturnType> {
    private callback;
    private timeout;
    private lastCall;
    private delay;
    constructor(callback: (...args: Args) => Promise<ReturnType>, delay?: number);
    cancel(): void;
    run(...args: Args): Promise<ReturnType>;
}
