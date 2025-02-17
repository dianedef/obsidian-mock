import type { 
    App,
    WorkspaceContainer as IWorkspaceContainer,
    WorkspaceParent
} from 'obsidian';
import { WorkspaceItem } from './workspace-items';

export class WorkspaceContainer extends WorkspaceItem implements IWorkspaceContainer {
    win: Window = window;
    doc: Document = document;
    containerEl: HTMLElement = document.createElement('div');

    constructor(app: App) {
        super(app, null);
    }

    getRoot(): IWorkspaceContainer {
        return this;
    }

    getContainer(): IWorkspaceContainer {
        return this;
    }

    get classList(): DOMTokenList {
        return this.containerEl.classList;
    }

    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
        this.containerEl.addEventListener(type, listener, options);
    }

    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
        this.containerEl.removeEventListener(type, listener, options);
    }

    appendChild<T extends Node>(node: T): T {
        return this.containerEl.appendChild(node);
    }

    removeChild<T extends Node>(node: T): T {
        return this.containerEl.removeChild(node);
    }

    focus(options?: FocusOptions): void {
        this.containerEl.focus(options);
    }

    // Getter pour accéder à l'élément HTML sous-jacent
    get htmlElement(): HTMLElement {
        return this.containerEl;
    }
} 