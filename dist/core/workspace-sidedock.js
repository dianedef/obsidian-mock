import { Events } from 'obsidian';
import { WorkspaceContainer } from './workspace-components';
export class WorkspaceSidedock extends WorkspaceContainer {
    constructor(side, parent, app) {
        super(parent);
        this.collapsed = false;
        this.events = new Events();
        this.side = side;
    }
    toggle() {
        this.collapsed = !this.collapsed;
        this.trigger('toggle');
    }
    expand() {
        this.collapsed = false;
        this.trigger('expand');
    }
    collapse() {
        this.collapsed = true;
        this.trigger('collapse');
    }
    getRoot() {
        return this.parent;
    }
    getContainer() {
        return this.parent;
    }
    on(name, callback, ctx) {
        return this.events.on(name, callback, ctx);
    }
    off(name, callback) {
        this.events.off(name, callback);
    }
    offref(ref) {
        this.events.offref(ref);
    }
    trigger(name, ...data) {
        this.events.trigger(name, ...data);
    }
}
