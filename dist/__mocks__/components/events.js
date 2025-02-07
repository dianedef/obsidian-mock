export class Events {
    constructor() {
        this.eventRefs = new Map();
        this.nextEventId = 1;
    }
    on(name, callback, ctx) {
        if (!this.eventRefs.has(name)) {
            this.eventRefs.set(name, new Set());
        }
        const eventSet = this.eventRefs.get(name);
        const id = `evt_${this.nextEventId++}`;
        const ref = { callback, ctx, id };
        eventSet.add(ref);
        return { id };
    }
    off(name, callback) {
        const eventSet = this.eventRefs.get(name);
        if (eventSet) {
            for (const ref of eventSet) {
                if (ref.callback === callback) {
                    eventSet.delete(ref);
                    break;
                }
            }
        }
    }
    offref(ref) {
        for (const eventSet of this.eventRefs.values()) {
            for (const eventRef of eventSet) {
                if (eventRef.id === ref.id) {
                    eventSet.delete(eventRef);
                    return;
                }
            }
        }
    }
    trigger(name, ...args) {
        const eventSet = this.eventRefs.get(name);
        if (eventSet) {
            for (const { callback, ctx } of eventSet) {
                callback.apply(ctx, args);
            }
        }
    }
    tryTrigger(name, ...args) {
        this.trigger(name, ...args);
    }
}
