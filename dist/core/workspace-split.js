import { WorkspaceParent } from 'obsidian';
function hasContainerEl(item) {
    return item && typeof item === 'object' && 'containerEl' in item && item.containerEl instanceof HTMLElement;
}
export class WorkspaceSplit extends WorkspaceParent {
    constructor(parent) {
        super();
        this.children = [];
        this.parent = parent || this;
        this.containerEl = document.createElement('div');
        this.containerEl.addClass('workspace-split');
        this.direction = 'vertical';
    }
    getRoot() {
        return this.parent?.getRoot() || this;
    }
    getContainer() {
        return this.parent?.getContainer();
    }
    addChild(child, index) {
        if (index === undefined) {
            this.children.push(child);
        }
        else {
            this.children.splice(index, 0, child);
        }
        if (hasContainerEl(child)) {
            this.containerEl.appendChild(child.containerEl);
        }
    }
    insertChild(index, child) {
        this.addChild(child, index);
    }
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            if (hasContainerEl(child)) {
                child.containerEl.detach();
            }
        }
    }
    replaceChild(oldChild, newChild) {
        const index = this.children.indexOf(oldChild);
        if (index > -1) {
            this.children[index] = newChild;
            if (hasContainerEl(oldChild)) {
                oldChild.containerEl.detach();
            }
            if (hasContainerEl(newChild)) {
                this.containerEl.appendChild(newChild.containerEl);
            }
        }
    }
    setDirection(direction) {
        this.direction = direction;
        this.containerEl.removeClass('workspace-split-horizontal');
        this.containerEl.removeClass('workspace-split-vertical');
        this.containerEl.addClass(`workspace-split-${direction}`);
    }
}
