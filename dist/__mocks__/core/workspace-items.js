import { Events } from '../components/events';
import { WorkspaceTabs as WorkspaceTabsBase } from './workspace-components';
export class WorkspaceItem extends Events {
    constructor(parent) {
        super();
        this.type = 'item';
        this.parent = parent;
    }
    getRoot() {
        return this.parent.getRoot();
    }
    getContainer() {
        return this.parent.getContainer();
    }
}
export class WorkspaceSplit extends WorkspaceItem {
    constructor(parent) {
        super(parent);
        this.children = [];
        this.type = 'split';
    }
    addChild(child, index) {
        if (typeof index === 'number') {
            this.children.splice(index, 0, child);
        }
        else {
            this.children.push(child);
        }
        child.parent = this;
    }
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            child.parent = this.getRoot();
        }
    }
}
export { WorkspaceTabsBase as WorkspaceTabs };
export class WorkspaceContainer extends WorkspaceSplit {
    constructor(parent) {
        super(parent);
        this.win = window;
        this.doc = document;
        this.containerEl = document.createElement('div');
        this.type = 'container';
    }
    getContainer() {
        return this;
    }
}
export class WorkspaceFloating extends WorkspaceSplit {
    constructor(parent) {
        super(parent);
        this.type = 'floating';
    }
}
