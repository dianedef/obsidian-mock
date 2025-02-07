export class Debouncer<Args extends any[], ReturnType> {
    private timeout: number | null = null;
    private lastCall: number = 0;
    private delay: number;

    constructor(
        private callback: (...args: Args) => Promise<ReturnType>,
        delay: number = 1000
    ) {
        this.delay = delay;
    }

    cancel(): void {
        if (this.timeout !== null) {
            window.clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    async run(...args: Args): Promise<ReturnType> {
        this.cancel();
        const now = Date.now();
        const timeSinceLastCall = now - this.lastCall;

        if (timeSinceLastCall >= this.delay) {
            this.lastCall = now;
            return this.callback(...args);
        }

        return new Promise((resolve, reject) => {
            this.timeout = window.setTimeout(async () => {
                try {
                    this.lastCall = Date.now();
                    const result = await this.callback(...args);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            }, this.delay - timeSinceLastCall);
        });
    }
} 