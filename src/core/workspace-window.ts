import { Component } from '../components/component';

interface WindowDimensions {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
}

export class WorkspaceWindow extends Component {
    containerEl: HTMLElement;
    isOpen: boolean = true;

    constructor(dimensions?: WindowDimensions) {
        super();
        this.containerEl = document.createElement('div');
        this.containerEl.classList.add('workspace-window');
        
        // Set default dimensions
        this.containerEl.style.width = dimensions?.width ? `${dimensions.width}px` : '800px';
        this.containerEl.style.height = dimensions?.height ? `${dimensions.height}px` : '600px';
        this.containerEl.style.left = dimensions?.x ? `${dimensions.x}px` : '100px';
        this.containerEl.style.top = dimensions?.y ? `${dimensions.y}px` : '100px';
    }

    onResize(): void {
        this.trigger('resize');
    }

    onClose(): void {
        if (this.isOpen) {
            this.trigger('window-close');
            this.isOpen = false;
        }
    }

    close(): void {
        this.onClose();
        if (this.containerEl.parentElement) {
            this.containerEl.parentElement.removeChild(this.containerEl);
        }
    }

    resize(): void {
        this.onResize();
    }
} 