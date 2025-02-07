import { WorkspaceItemBase } from './workspace-item-base';
export class WorkspaceMobileDrawer extends WorkspaceItemBase {
    constructor(rootSplit, app) {
        super();
        this.type = 'mobile-drawer';
        this.children = [];
        this._parent = rootSplit;
        this.containerEl = document.createElement('div');
        this.containerEl.addClass('workspace-drawer');
    }
    get parent() {
        return this._parent;
    }
    set parent(value) {
        this._parent = value;
    }
    getRoot() {
        return this.parent?.getRoot() || this;
    }
    getContainer() {
        return this.parent?.getContainer() || null;
    }
    collapse() {
        if (!this.collapsed) {
            this.collapsed = true;
            this.containerEl.addClass('is-collapsed');
        }
    }
    expand() {
        if (this.collapsed) {
            this.collapsed = false;
            this.containerEl.removeClass('is-collapsed');
        }
    }
    toggle() {
        if (this.collapsed) {
            this.expand();
        }
        else {
            this.collapse();
        }
    }
    addChild(child, index) {
        if (typeof index === 'number') {
            this.children.splice(index, 0, child);
        }
        else {
            this.children.push(child);
        }
    }
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }
    get collapsed() {
        return this.containerEl.hasClass('is-collapsed');
    }
    set collapsed(value) {
        if (value) {
            this.containerEl.addClass('is-collapsed');
        }
        else {
            this.containerEl.removeClass('is-collapsed');
        }
    }
}
