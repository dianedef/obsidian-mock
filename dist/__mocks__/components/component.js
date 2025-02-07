import { vi } from 'vitest';
export class BaseComponent {
    constructor() {
        this.loaded = false;
        this.children = [];
        this.cleanupCallbacks = [];
        this.intervals = [];
        this.onload = vi.fn();
        this.onunload = vi.fn();
        this.load = vi.fn().mockImplementation(() => {
            if (this.loaded)
                return;
            this.onload();
            this.children.forEach(child => child.load());
            this.loaded = true;
        });
        this.unload = vi.fn().mockImplementation(() => {
            if (!this.loaded)
                return;
            this.children.forEach(child => child.unload());
            this.intervals.forEach(id => window.clearInterval(id));
            this.cleanupCallbacks.forEach(cb => cb());
            this.children = [];
            this.cleanupCallbacks = [];
            this.intervals = [];
            this.onunload();
            this.loaded = false;
        });
        this.addChild = vi.fn().mockImplementation((component) => {
            this.children.push(component);
            if (this.loaded) {
                component.load();
            }
            return component;
        });
        this.removeChild = vi.fn().mockImplementation((component) => {
            const index = this.children.indexOf(component);
            if (index > -1) {
                component.unload();
                this.children.splice(index, 1);
            }
            return component;
        });
        this.register = vi.fn().mockImplementation((cb) => {
            this.cleanupCallbacks.push(cb);
        });
        this.registerEvent = vi.fn();
        this.registerDomEvent = vi.fn();
        this.registerInterval = vi.fn().mockImplementation((id) => {
            this.intervals.push(id);
            return id;
        });
    }
}
