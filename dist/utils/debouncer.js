export class Debouncer {
    constructor(callback, delay = 1000) {
        this.callback = callback;
        this.timeout = null;
        this.lastCall = 0;
        this.delay = delay;
    }
    cancel() {
        if (this.timeout !== null) {
            window.clearTimeout(this.timeout);
            this.timeout = null;
        }
    }
    async run(...args) {
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
                }
                catch (error) {
                    reject(error);
                }
            }, this.delay - timeSinceLastCall);
        });
    }
}
