import { Events } from 'obsidian';
export class Component extends Events {
    constructor() {
        super(...arguments);
        this.children = [];
        this.domEventRefs = [];
        this.intervalIds = [];
        this.registeredCallbacks = [];
    }
    load() { }
    onload() { }
    unload() {
        // Clean up event listeners
        this.domEventRefs.forEach(ref => {
            if (ref && typeof ref === 'object' && 'detach' in ref && typeof ref.detach === 'function') {
                ref.detach();
            }
        });
        this.domEventRefs = [];
        // Clear intervals
        this.intervalIds.forEach(id => window.clearInterval(id));
        this.intervalIds = [];
        // Clear registered callbacks
        this.registeredCallbacks.forEach(cb => cb());
        this.registeredCallbacks = [];
        // Unload children
        this.children.forEach(child => child.unload());
        this.children = [];
    }
    onunload() { }
    addChild(component) {
        this.children.push(component);
        return component;
    }
    removeChild(component) {
        const index = this.children.indexOf(component);
        if (index > -1) {
            this.children.splice(index, 1);
        }
        return component;
    }
    register(cb) {
        this.registeredCallbacks.push(cb);
    }
    registerDomEvent(el, type, callback, options) {
        el.addEventListener(type, callback, options);
        this.domEventRefs.push({
            detach: () => el.removeEventListener(type, callback, options)
        });
    }
    registerInterval(id) {
        this.intervalIds.push(id);
        return id;
    }
    registerEvent(eventRef) {
        if (eventRef) {
            this.domEventRefs.push(eventRef);
        }
    }
}
