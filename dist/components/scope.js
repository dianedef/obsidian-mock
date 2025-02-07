export class Scope {
    constructor() {
        this.handlers = [];
    }
    register(modifiers, key, func) {
        const handler = {
            modifiers: modifiers ? modifiers.join('+') : null,
            key: key || '',
            func,
            scope: this
        };
        this.handlers.push(handler);
        return handler;
    }
    unregister(handler) {
        const index = this.handlers.indexOf(handler);
        if (index > -1) {
            this.handlers.splice(index, 1);
        }
    }
}
