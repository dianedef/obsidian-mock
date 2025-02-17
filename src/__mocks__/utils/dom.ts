import { vi } from 'vitest';

interface DomElementInfo {
    cls?: string;
    text?: string;
    attr?: Record<string, string>;
    title?: string;
}

type IconName = string;
interface TooltipOptions {
    placement?: string;
}

declare global {
    interface Element {
        addClass(cls: string): void;
        removeClass(cls: string): void;
        toggleClass(cls: string, value?: boolean): void;
        setText(text: string): void;
        empty(): void;
        detach(): void;
        createDiv(options?: DomElementInfo | string): HTMLDivElement;
        createSpan(options?: DomElementInfo | string): HTMLSpanElement;
        createEl<K extends keyof HTMLElementTagNameMap>(tag: K, options?: DomElementInfo | string): HTMLElementTagNameMap[K];
    }
}

// Implémente les méthodes sur le prototype de Element
if (typeof Element !== 'undefined') {
    Element.prototype.addClass = function(cls: string): void {
        this.classList.add(cls);
    };

    Element.prototype.removeClass = function(cls: string): void {
        this.classList.remove(cls);
    };

    Element.prototype.toggleClass = function(cls: string, value?: boolean): void {
        if (value !== undefined) {
            this.classList.toggle(cls, value);
        } else {
            this.classList.toggle(cls);
        }
    };

    Element.prototype.setText = function(text: string): void {
        this.textContent = text;
    };

    Element.prototype.empty = function(): void {
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }
    };

    Element.prototype.detach = function(): void {
        this.remove();
    };

    Element.prototype.createDiv = function(options?: DomElementInfo | string): HTMLDivElement {
        const div = document.createElement('div');
        if (typeof options === 'string') {
            div.addClass(options);
        } else if (options) {
            if (options.cls) {
                div.addClass(options.cls);
            }
            if (options.text) {
                div.setText(options.text);
            }
            if (options.attr) {
                Object.entries(options.attr).forEach(([key, value]) => {
                    div.setAttribute(key, value);
                });
            }
            if (options.title) {
                div.setAttribute('title', options.title);
            }
        }
        this.appendChild(div);
        return div;
    };

    Element.prototype.createSpan = function(options?: DomElementInfo | string): HTMLSpanElement {
        const span = document.createElement('span');
        if (typeof options === 'string') {
            span.addClass(options);
        } else if (options) {
            if (options.cls) {
                span.addClass(options.cls);
            }
            if (options.text) {
                span.setText(options.text);
            }
            if (options.attr) {
                Object.entries(options.attr).forEach(([key, value]) => {
                    span.setAttribute(key, value);
                });
            }
            if (options.title) {
                span.setAttribute('title', options.title);
            }
        }
        this.appendChild(span);
        return span;
    };

    Element.prototype.createEl = function<K extends keyof HTMLElementTagNameMap>(
        tag: K,
        options?: DomElementInfo | string
    ): HTMLElementTagNameMap[K] {
        const el = document.createElement(tag);
        if (typeof options === 'string') {
            el.addClass(options);
        } else if (options) {
            if (options.cls) {
                el.addClass(options.cls);
            }
            if (options.text) {
                el.setText(options.text);
            }
            if (options.attr) {
                Object.entries(options.attr).forEach(([key, value]) => {
                    el.setAttribute(key, value);
                });
            }
            if (options.title) {
                el.setAttribute('title', options.title);
            }
        }
        this.appendChild(el);
        return el;
    };
}

// Exporte un helper pour tester si les méthodes sont disponibles
export function isDOMSupported(): boolean {
    return typeof Element !== 'undefined';
}

export const setIcon = vi.fn((parent: HTMLElement, iconId: IconName): void => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.addClass('svg-icon');
    svg.setAttribute('icon-id', iconId);
    parent.appendChild(svg);
});

export const setTooltip = vi.fn((el: HTMLElement, tooltip: string, options?: TooltipOptions): void => {
    el.setAttribute('aria-label', tooltip);
    if (options?.placement) {
        el.setAttribute('data-tooltip-position', options.placement);
    }
});

declare global {
    interface HTMLElement {
        addClass(cls: string): void;
        removeClass(cls: string): void;
        toggleClass(cls: string, value?: boolean): void;
        setText(text: string): void;
        getText(): string;
        createDiv(cls?: string): HTMLElement;
        empty(): void;
        detach(): void;
        contains(element: HTMLElement): boolean;
        hasClass(cls: string): boolean;
    }
}

// Étendre le prototype de HTMLElement avec les méthodes Obsidian
HTMLElement.prototype.addClass = function(cls: string): void {
    this.classList.add(cls);
};

HTMLElement.prototype.removeClass = function(cls: string): void {
    this.classList.remove(cls);
};

HTMLElement.prototype.toggleClass = function(cls: string, value: boolean): void {
    this.classList.toggle(cls, value);
};

HTMLElement.prototype.setText = function(text: string): void {
    this.textContent = text;
};

HTMLElement.prototype.createDiv = function(cls?: string): HTMLElement {
    const div = document.createElement('div');
    if (cls) {
        div.addClass(cls);
    }
    this.appendChild(div);
    return div;
};

HTMLElement.prototype.empty = function(): void {
    while (this.firstChild) {
        this.removeChild(this.firstChild);
    }
};

HTMLElement.prototype.detach = function(): void {
    this.remove();
};

HTMLElement.prototype.getText = function(): string {
    return this.textContent || '';
};

HTMLElement.prototype.hasClass = function(cls: string): boolean {
    return this.classList.contains(cls);
};

HTMLElement.prototype.contains = function(element: HTMLElement): boolean {
    return Node.prototype.contains.call(this, element);
};

// Mock pour jsdom
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Définition des classes DOM manquantes
class DragEvent extends Event {
    dataTransfer: DataTransfer;

    constructor(type: string, init?: DragEventInit) {
        super(type, init);
        this.dataTransfer = init?.dataTransfer || new DataTransfer();
    }
}

class DataTransfer {
    private data: Map<string, string> = new Map();

    setData(format: string, data: string): void {
        this.data.set(format, data);
    }

    getData(format: string): string {
        return this.data.get(format) || '';
    }

    clearData(format?: string): void {
        if (format) {
            this.data.delete(format);
        } else {
            this.data.clear();
        }
    }
}

// Ajout des classes au global
Object.assign(global, {
    DragEvent,
    DataTransfer
});

// Mock des méthodes DOM
HTMLElement.prototype.createDiv = function(className?: string): HTMLDivElement {
    const div = document.createElement('div');
    if (className) {
        div.className = className;
    }
    this.appendChild(div);
    return div;
};

HTMLElement.prototype.createSpan = function(className?: string): HTMLSpanElement {
    const span = document.createElement('span');
    if (className) {
        span.className = className;
    }
    this.appendChild(span);
    return span;
};

HTMLElement.prototype.setText = function(text: string): void {
    this.textContent = text;
};

// Export des types pour TypeScript
export type { DragEvent, DataTransfer }; 