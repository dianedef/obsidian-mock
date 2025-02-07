// Implémente les méthodes sur le prototype de Element
if (typeof Element !== 'undefined') {
    Element.prototype.addClass = function (cls) {
        this.classList.add(cls);
    };
    Element.prototype.removeClass = function (cls) {
        this.classList.remove(cls);
    };
    Element.prototype.toggleClass = function (cls, value) {
        this.classList.toggle(cls, value);
    };
    Element.prototype.setText = function (text) {
        this.textContent = text;
    };
    Element.prototype.empty = function () {
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }
    };
    Element.prototype.detach = function () {
        this.remove();
    };
    Element.prototype.createDiv = function (options) {
        const div = document.createElement('div');
        if (options?.cls) {
            div.addClass(options.cls);
        }
        this.appendChild(div);
        return div;
    };
    Element.prototype.createSpan = function (options) {
        const span = document.createElement('span');
        if (options?.cls) {
            span.addClass(options.cls);
        }
        this.appendChild(span);
        return span;
    };
    Element.prototype.createEl = function (tag, options) {
        const el = document.createElement(tag);
        if (options?.cls) {
            el.addClass(options.cls);
        }
        if (options?.attr) {
            Object.entries(options.attr).forEach(([key, value]) => {
                el.setAttribute(key, value);
            });
        }
        this.appendChild(el);
        return el;
    };
}
// Exporte un helper pour tester si les méthodes sont disponibles
export function isDOMSupported() {
    return typeof Element !== 'undefined';
}
import { vi } from 'vitest';
export const setIcon = vi.fn((parent, iconId) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.addClass('svg-icon');
    svg.setAttribute('icon-id', iconId);
    parent.appendChild(svg);
});
export const setTooltip = vi.fn((el, tooltip, options) => {
    el.setAttribute('aria-label', tooltip);
    if (options?.placement) {
        el.setAttribute('data-tooltip-position', options.placement);
    }
});
// Étend HTMLElement avec les méthodes de manipulation de classe d'Obsidian
HTMLElement.prototype.addClass = function (className) {
    this.classList.add(className);
};
HTMLElement.prototype.removeClass = function (className) {
    this.classList.remove(className);
};
HTMLElement.prototype.toggleClass = function (className, value) {
    if (value !== undefined) {
        this.classList.toggle(className, value);
    }
    else {
        this.classList.toggle(className);
    }
};
HTMLElement.prototype.hasClass = function (className) {
    return this.classList.contains(className);
};
// Étend HTMLElement avec les méthodes de manipulation du DOM d'Obsidian
HTMLElement.prototype.empty = function () {
    while (this.firstChild) {
        this.removeChild(this.firstChild);
    }
};
HTMLElement.prototype.detach = function () {
    if (this.parentNode) {
        this.parentNode.removeChild(this);
    }
};
