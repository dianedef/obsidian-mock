import { vi } from 'vitest';
// Extensions DOM
if (typeof window !== 'undefined') {
    // Window extensions
    window.fish = function (selector) {
        return document.querySelector(selector);
    };
    window.fishAll = function (selector) {
        return Array.from(document.querySelectorAll(selector));
    };
    window.ready = async function () {
        return new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            }
            else {
                document.addEventListener('DOMContentLoaded', () => resolve());
            }
        });
    };
    window.sleep = async function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
    window.nextFrame = async function () {
        return new Promise(resolve => requestAnimationFrame(() => resolve()));
    };
    // Element extensions
    Element.prototype.find = function (selector) {
        return this.querySelector(selector);
    };
    Element.prototype.findAll = function (selector) {
        return Array.from(this.querySelectorAll(selector));
    };
    Element.prototype.findAllSelf = function (selector) {
        return Array.from(this.querySelectorAll(selector));
    };
    // Node extensions
    Node.prototype.detach = function () {
        if (this.parentNode)
            this.parentNode.removeChild(this);
    };
    Node.prototype.empty = function () {
        while (this.firstChild)
            this.removeChild(this.firstChild);
    };
    Node.prototype.insertAfter = function (node, child) {
        if (child && child.nextSibling) {
            this.insertBefore(node, child.nextSibling);
        }
        else {
            this.appendChild(node);
        }
        return node;
    };
    Node.prototype.indexOf = function (other) {
        return Array.from(this.childNodes).indexOf(other);
    };
    Node.prototype.setChildrenInPlace = function (children) {
        while (this.firstChild)
            this.removeChild(this.firstChild);
        children.forEach(child => this.appendChild(child));
    };
    Node.prototype.appendText = function (val) {
        this.appendChild(document.createTextNode(val));
    };
    Node.prototype.instanceOf = function (type) {
        return this instanceof type;
    };
}
// Native object extensions
Object.isEmpty = vi.fn((object) => Object.keys(object).length === 0);
Object.each = vi.fn((object, callback, context) => {
    for (const [key, value] of Object.entries(object)) {
        if (callback.call(context, value, key) === false)
            break;
    }
    return true;
});
Array.combine = vi.fn().mockImplementation((arrays) => arrays.flat());
Array.prototype.first = function () { return this[0]; };
Array.prototype.last = function () { return this[this.length - 1]; };
Array.prototype.contains = function (target) { return this.includes(target); };
Array.prototype.remove = function (target) {
    const index = this.indexOf(target);
    if (index > -1)
        this.splice(index, 1);
};
Array.prototype.shuffle = function () {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
};
Array.prototype.unique = function () { return [...new Set(this)]; };
Array.prototype.findLastIndex = function (predicate) {
    for (let i = this.length - 1; i >= 0; i--) {
        if (predicate(this[i]))
            return i;
    }
    return -1;
};
Math.clamp = vi.fn((value, min, max) => Math.min(Math.max(value, min), max));
Math.square = vi.fn((value) => value * value);
String.isString = function (obj) { return typeof obj === 'string'; };
String.prototype.contains = function (target) { return this.includes(target); };
String.prototype.format = function (...args) {
    return this.replace(/{(\d+)}/g, (match, num) => {
        return typeof args[num] !== 'undefined' ? args[num] : match;
    });
};
Number.isNumber = function (obj) { return typeof obj === 'number'; };
// Global functions
window.ajax = vi.fn((options) => {
    const req = options.req || new XMLHttpRequest();
    req.open(options.method || 'GET', options.url);
    if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => req.setRequestHeader(key, value));
    }
    if (options.withCredentials)
        req.withCredentials = true;
    req.onload = () => options.success?.(req.response, req);
    req.onerror = () => options.error?.(req.statusText, req);
    const data = typeof options.data === 'object' ? JSON.stringify(options.data) : options.data;
    req.send(data);
});
window.ajaxPromise = vi.fn((options) => new Promise((resolve, reject) => {
    window.ajax({
        ...options,
        success: (response) => resolve(response),
        error: (error) => reject(error)
    });
}));
// Touch API mock
if ('Touch' in window) {
    Object.defineProperty(Touch.prototype, 'touchType', {
        get: function () { return 'direct'; }
    });
}
// Active window/document
Object.defineProperty(window, 'activeWindow', {
    get: () => window
});
Object.defineProperty(window, 'activeDocument', {
    get: () => document
});
// Implémentation des nouvelles méthodes
Array.prototype.findLastIndex = function (predicate) {
    for (let i = this.length - 1; i >= 0; i--) {
        if (predicate(this[i]))
            return i;
    }
    return -1;
};
String.prototype.format = function (...args) {
    return this.replace(/{(\d+)}/g, (match, num) => {
        return typeof args[num] !== 'undefined' ? args[num] : match;
    });
};
// Implémentation des méthodes de création d'éléments
if (typeof window !== 'undefined') {
    Node.prototype.createEl = function (tag, o, callback) {
        const el = document.createElement(tag);
        if (typeof o === 'string') {
            el.classList.add(o);
        }
        else if (o) {
            if (o.cls) {
                if (Array.isArray(o.cls)) {
                    el.classList.add(...o.cls);
                }
                else {
                    el.classList.add(o.cls);
                }
            }
            if (o.text)
                el.setText(o.text);
            if (o.attr)
                el.setAttrs(o.attr);
            if (o.title)
                el.setAttr('title', o.title);
            if (o.parent) {
                if (o.prepend && 'prepend' in o.parent) {
                    o.parent.prepend(el);
                }
                else {
                    o.parent.appendChild(el);
                }
            }
            if (o.value)
                el.setAttr('value', o.value);
            if (o.type)
                el.setAttr('type', o.type);
            if (o.placeholder)
                el.setAttr('placeholder', o.placeholder);
            if (o.href)
                el.setAttr('href', o.href);
        }
        callback?.(el);
        return el;
    };
    Node.prototype.createDiv = function (o, callback) {
        return this.createEl('div', o, callback);
    };
    Node.prototype.createSpan = function (o, callback) {
        return this.createEl('span', o, callback);
    };
    Node.prototype.createSvg = function (tag, o, callback) {
        const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        if (typeof o === 'string') {
            el.classList.add(o);
        }
        else if (o) {
            if (o.cls) {
                if (Array.isArray(o.cls)) {
                    el.classList.add(...o.cls);
                }
                else {
                    el.classList.add(o.cls);
                }
            }
            if (o.attr)
                el.setAttrs(o.attr);
            if (o.parent) {
                if (o.prepend && 'prepend' in o.parent) {
                    o.parent.prepend(el);
                }
                else {
                    o.parent.appendChild(el);
                }
            }
        }
        callback?.(el);
        return el;
    };
    // Implémentation des méthodes d'événements manquantes
    HTMLElement.prototype.onClickEvent = function (listener, options) {
        this.addEventListener('click', listener, options);
    };
    HTMLElement.prototype.onNodeInserted = function (listener, once = false) {
        const callback = () => {
            if (document.contains(this)) {
                listener();
                if (once) {
                    document.removeEventListener('DOMNodeInserted', callback);
                }
            }
        };
        document.addEventListener('DOMNodeInserted', callback);
        return () => document.removeEventListener('DOMNodeInserted', callback);
    };
    HTMLElement.prototype.onWindowMigrated = function (listener) {
        const callback = () => listener(window);
        window.addEventListener('window-migrated', callback);
        return () => window.removeEventListener('window-migrated', callback);
    };
}
export const setupGlobalMocks = () => {
    // Cette fonction peut être appelée pour s'assurer que les mocks sont en place
    // Utile pour réinitialiser l'état entre les tests
};
