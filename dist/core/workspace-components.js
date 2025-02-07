import { Events } from 'obsidian';
export class WorkspaceItem extends Events {
    constructor(parent) {
        super();
        this.parent = parent;
        this.containerEl = document.createElement('div');
    }
    getRoot() {
        let item = this;
        while (item.parent) {
            item = item.parent;
        }
        return item;
    }
    getContainer() {
        return this.parent.getContainer();
    }
    on(name, callback, ctx) {
        super.on(name, callback, ctx);
        return { id: Math.random().toString() };
    }
    offref(ref) {
        super.offref(ref);
    }
    off(name, callback) {
        super.off(name, callback);
    }
    trigger(name, ...data) {
        super.trigger(name, ...data);
    }
}
export class WorkspaceContainer extends WorkspaceItem {
    constructor(parent) {
        super(parent);
        this.children = [];
        this.win = window;
        this.doc = document;
        this.containerEl.addClass('workspace-container');
    }
    getContainer() {
        return this;
    }
    addChild(child, index) {
        if (typeof index === 'number' && index >= 0) {
            this.children.splice(index, 0, child);
        }
        else {
            this.children.push(child);
        }
        child.parent = this;
        this.containerEl.appendChild(child.containerEl);
    }
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            child.containerEl.detach();
            child.parent = null;
        }
    }
    setChildren(children) {
        // Remove old children
        for (const child of this.children) {
            child.containerEl.detach();
            child.parent = null;
        }
        // Add new children
        this.children = children;
        for (const child of children) {
            child.parent = this;
            this.containerEl.appendChild(child.containerEl);
        }
    }
    empty() {
        this.setChildren([]);
    }
}
