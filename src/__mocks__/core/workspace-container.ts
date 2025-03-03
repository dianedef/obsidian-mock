export class WorkspaceContainer {
    private element: HTMLDivElement;

    constructor() {
        this.element = document.createElement('div');
    }

    get classList(): DOMTokenList {
        return this.element.classList;
    }

    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
        this.element.addEventListener(type, listener, options);
    }

    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
        this.element.removeEventListener(type, listener, options);
    }

    appendChild<T extends Node>(node: T): T {
        return this.element.appendChild(node);
    }

    removeChild<T extends Node>(node: T): T {
        return this.element.removeChild(node);
    }

    focus(options?: FocusOptions): void {
        this.element.focus(options);
    }

    // Getter pour accéder à l'élément HTML sous-jacent
    get htmlElement(): HTMLElement {
        return this.element;
    }
} 