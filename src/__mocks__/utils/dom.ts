import { vi } from 'vitest';
import type { IconName, TooltipOptions, DomElementInfo } from 'obsidian';

declare global {
    interface Element {
        addClass(cls: string): void;
        removeClass(cls: string): void;
        toggleClass(cls: string, value: boolean): void;
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

    Element.prototype.toggleClass = function(cls: string, value: boolean): void {
        this.classList.toggle(cls, value);
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

// Étend HTMLElement avec les méthodes de manipulation de classe d'Obsidian
HTMLElement.prototype.addClass = function(className: string): void {
    this.classList.add(className);
};

HTMLElement.prototype.removeClass = function(className: string): void {
    this.classList.remove(className);
};

HTMLElement.prototype.toggleClass = function(className: string, value?: boolean): void {
    if (value !== undefined) {
        this.classList.toggle(className, value);
    } else {
        this.classList.toggle(className);
    }
};

HTMLElement.prototype.hasClass = function(className: string): boolean {
    return this.classList.contains(className);
};

// Étend HTMLElement avec les méthodes de manipulation du DOM d'Obsidian
HTMLElement.prototype.empty = function(): void {
    while (this.firstChild) {
        this.removeChild(this.firstChild);
    }
};

HTMLElement.prototype.detach = function(): void {
    if (this.parentNode) {
        this.parentNode.removeChild(this);
    }
};

// Déclare les types pour TypeScript
declare global {
    interface HTMLElement {
        addClass(className: string): void;
        removeClass(className: string): void;
        toggleClass(className: string, value?: boolean): void;
        hasClass(className: string): boolean;
        empty(): void;
        detach(): void;
    }
} 