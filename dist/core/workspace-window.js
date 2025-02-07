import { Component } from '../components/component';
export class WorkspaceWindow extends Component {
    constructor(dimensions) {
        super();
        this.isOpen = true;
        this.containerEl = document.createElement('div');
        this.containerEl.classList.add('workspace-window');
        // Set default dimensions
        this.containerEl.style.width = dimensions?.width ? `${dimensions.width}px` : '800px';
        this.containerEl.style.height = dimensions?.height ? `${dimensions.height}px` : '600px';
        this.containerEl.style.left = dimensions?.x ? `${dimensions.x}px` : '100px';
        this.containerEl.style.top = dimensions?.y ? `${dimensions.y}px` : '100px';
    }
    onResize() {
        this.trigger('resize');
    }
    onClose() {
        if (this.isOpen) {
            this.trigger('window-close');
            this.isOpen = false;
        }
    }
    close() {
        this.onClose();
        if (this.containerEl.parentElement) {
            this.containerEl.parentElement.removeChild(this.containerEl);
        }
    }
    resize() {
        this.onResize();
    }
}
