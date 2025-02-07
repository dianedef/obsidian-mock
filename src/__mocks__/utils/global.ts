import { vi } from 'vitest';
import type { DomElementInfo, SvgElementInfo } from 'obsidian';

// Global declaration at top level
declare global {
    interface EventListenerInfo {
        selector: string;
        listener: Function;
        options?: boolean | AddEventListenerOptions;
        callback: Function;
    }

    interface Window {
        isBoolean: (obj: any) => obj is boolean;
        fish: (selector: string) => HTMLElement | null;
        fishAll: (selector: string) => HTMLElement[];
        ajax: Function;
        ajaxPromise: Function;
        ready: () => Promise<void>;
        sleep: (ms: number) => Promise<void>;
        nextFrame: () => Promise<void>;
        activeWindow: Window;
        activeDocument: Document;
    }

    interface Element {
        _EVENTS?: {
            [K in keyof HTMLElementEventMap]?: EventListenerInfo[];
        };
        show(): void;
        hide(): void;
        toggle(show: boolean): void;
        toggleVisibility(visible: boolean): void;
        isShown(): boolean;
        setCssStyles(styles: Partial<CSSStyleDeclaration>): void;
        setCssProps(props: Record<string, string>): void;
        on<K extends keyof HTMLElementEventMap>(
            type: K,
            selector: string,
            listener: (this: HTMLElement, ev: HTMLElementEventMap[K], delegateTarget: HTMLElement) => void,
            options?: boolean | AddEventListenerOptions
        ): void;
        off<K extends keyof HTMLElementEventMap>(
            type: K,
            selector: string,
            listener: (this: HTMLElement, ev: HTMLElementEventMap[K], delegateTarget: HTMLElement) => void,
            options?: boolean | EventListenerOptions
        ): void;
        trigger(eventType: string): void;
        onClickEvent(
            listener: (this: HTMLElement, ev: MouseEvent) => any,
            options?: boolean | AddEventListenerOptions
        ): void;
        onNodeInserted(listener: () => any, once?: boolean): () => void;
        onWindowMigrated(listener: (win: Window) => any): () => void;
        getText(): string;
        setText(val: string | DocumentFragment): void;
        addClass(...classes: string[]): void;
        addClasses(classes: string[]): void;
        removeClass(...classes: string[]): void;
        removeClasses(classes: string[]): void;
        toggleClass(classes: string | string[], value?: boolean): void;
        hasClass(cls: string): boolean;
        setAttr(name: string, value: string | number | boolean | null): void;
        setAttrs(attrs: Record<string, string | number | boolean | null>): void;
        getAttr(name: string): string | null;
        matchParent(selector: string, lastParent?: Element): Element | null;
        getCssPropertyValue(prop: string, pseudo?: string): string;
        isActiveElement(): boolean;
        find: (selector: string) => Element | null;
        findAll: (selector: string) => HTMLElement[];
        findAllSelf: (selector: string) => HTMLElement[];
    }

    interface Document {
        _EVENTS?: {
            [K in keyof DocumentEventMap]?: EventListenerInfo[];
        };
        on<K extends keyof DocumentEventMap>(
            type: K,
            selector: string,
            listener: (this: Document, ev: DocumentEventMap[K], delegateTarget: HTMLElement) => any,
            options?: boolean | AddEventListenerOptions
        ): void;
        off<K extends keyof DocumentEventMap>(
            type: K,
            selector: string,
            listener: (this: Document, ev: DocumentEventMap[K], delegateTarget: HTMLElement) => any,
            options?: boolean | AddEventListenerOptions
        ): void;
    }

    interface Node {
        detach(): void;
        empty(): void;
        insertAfter<T extends Node>(node: T, child: Node | null): T;
        indexOf(other: ChildNode): number;
        setChildrenInPlace(children: Node[]): void;
        appendText(val: string): void;
        instanceOf<T>(type: new () => T): this is T;
        doc: Document;
        win: Window;
        constructorWin: Window;
        createEl<K extends keyof HTMLElementTagNameMap>(
            tag: K,
            o?: DomElementInfo | string,
            callback?: (el: HTMLElementTagNameMap[K]) => void
        ): HTMLElementTagNameMap[K];
        createDiv(o?: DomElementInfo | string, callback?: (el: HTMLDivElement) => void): HTMLDivElement;
        createSpan(o?: DomElementInfo | string, callback?: (el: HTMLSpanElement) => void): HTMLSpanElement;
        createSvg<K extends keyof SVGElementTagNameMap>(
            tag: K,
            o?: SvgElementInfo | string,
            callback?: (el: SVGElementTagNameMap[K]) => void
        ): SVGElementTagNameMap[K];
    }

    interface UIEvent extends Event {
        targetNode: Node | null;
        win: Window;
        doc: Document;
        instanceOf<T>(type: { new (...data: any[]): T }): this is T;
    }

    interface AjaxOptions {
        method?: 'GET' | 'POST';
        url: string;
        success?: (response: any, req: XMLHttpRequest) => any;
        error?: (error: any, req: XMLHttpRequest) => any;
        data?: object | string | ArrayBuffer;
        headers?: Record<string, string>;
        withCredentials?: boolean;
        req?: XMLHttpRequest;
    }
}

// Extensions DOM
if (typeof window !== 'undefined') {
    // Window extensions
    window.fish = function(selector: string): HTMLElement | null {
        return document.querySelector(selector) as HTMLElement | null;
    };

    window.fishAll = function(selector: string): HTMLElement[] {
        return Array.from(document.querySelectorAll(selector)) as HTMLElement[];
    };

    window.ready = async function(): Promise<void> {
        return new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                document.addEventListener('DOMContentLoaded', () => resolve());
            }
        });
    };

    window.sleep = async function(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    window.nextFrame = async function(): Promise<void> {
        return new Promise(resolve => requestAnimationFrame(() => resolve()));
    };

    // Element extensions
    Element.prototype.find = function(selector: string): Element | null {
        return this.querySelector(selector);
    };

    Element.prototype.findAll = function(selector: string): HTMLElement[] {
        return Array.from(this.querySelectorAll(selector)) as HTMLElement[];
    };

    Element.prototype.findAllSelf = function(selector: string): HTMLElement[] {
        return Array.from(this.querySelectorAll(selector)) as HTMLElement[];
    };

    // Node extensions
    Node.prototype.detach = function(this: Node) { 
        if (this.parentNode) this.parentNode.removeChild(this); 
    };

    Node.prototype.empty = function(this: Node) { 
        while (this.firstChild) this.removeChild(this.firstChild); 
    };

    Node.prototype.insertAfter = function<T extends Node>(node: T, child: Node | null): T {
        if (child && child.nextSibling) {
            this.insertBefore(node, child.nextSibling);
        } else {
            this.appendChild(node);
        }
        return node;
    };

    Node.prototype.indexOf = function(other: ChildNode): number {
        return Array.from(this.childNodes).indexOf(other);
    };

    Node.prototype.setChildrenInPlace = function(this: Node, children: Node[]) {
        while (this.firstChild) this.removeChild(this.firstChild);
        children.forEach(child => this.appendChild(child));
    };

    Node.prototype.appendText = function(this: Node, val: string) {
        this.appendChild(document.createTextNode(val));
    };

    Node.prototype.instanceOf = function<T>(type: new () => T): this is T {
        return this instanceof type;
    };
}

// Native object extensions
Object.isEmpty = vi.fn((object: Record<string, any>) => Object.keys(object).length === 0);
Object.each = vi.fn((object: Record<string, any>, callback: (value: any, key?: string) => boolean | void, context?: any) => {
    for (const [key, value] of Object.entries(object)) {
        if (callback.call(context, value, key) === false) break;
    }
    return true;
});

Array.combine = vi.fn().mockImplementation(<T>(arrays: T[][]): T[] => arrays.flat());
Array.prototype.first = function() { return this[0]; };
Array.prototype.last = function() { return this[this.length - 1]; };
Array.prototype.contains = function(target) { return this.includes(target); };
Array.prototype.remove = function(target) { 
    const index = this.indexOf(target);
    if (index > -1) this.splice(index, 1);
};
Array.prototype.shuffle = function() {
    for (let i = this.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this[i], this[j]] = [this[j], this[i]];
    }
    return this;
};
Array.prototype.unique = function() { return [...new Set(this)]; };
Array.prototype.findLastIndex = function<T>(predicate: (value: T) => boolean): number {
    for (let i = this.length - 1; i >= 0; i--) {
        if (predicate(this[i])) return i;
    }
    return -1;
};

Math.clamp = vi.fn((value, min, max) => Math.min(Math.max(value, min), max));
Math.square = vi.fn((value) => value * value);

String.isString = function(obj: any): obj is string { return typeof obj === 'string'; };
String.prototype.contains = function(target) { return this.includes(target); };
String.prototype.format = function(...args: string[]): string {
    return this.replace(/{(\d+)}/g, (match, num) => {
        return typeof args[num] !== 'undefined' ? args[num] : match;
    });
};

Number.isNumber = function(obj: any): obj is number { return typeof obj === 'number'; };

// Global functions
window.ajax = vi.fn((options: AjaxOptions) => {
    const req = options.req || new XMLHttpRequest();
    req.open(options.method || 'GET', options.url);
    if (options.headers) {
        Object.entries(options.headers).forEach(([key, value]) => 
            req.setRequestHeader(key, value));
    }
    if (options.withCredentials) req.withCredentials = true;
    req.onload = () => options.success?.(req.response, req);
    req.onerror = () => options.error?.(req.statusText, req);
    const data = typeof options.data === 'object' ? JSON.stringify(options.data) : options.data;
    req.send(data as XMLHttpRequestBodyInit);
});

window.ajaxPromise = vi.fn((options: AjaxOptions) => 
    new Promise((resolve, reject) => {
        window.ajax({
            ...options,
            success: (response) => resolve(response),
            error: (error) => reject(error)
        });
    })
);

// Touch API mock
if ('Touch' in window) {
    Object.defineProperty(Touch.prototype, 'touchType', {
        get: function() { return 'direct'; }
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
Array.prototype.findLastIndex = function<T>(predicate: (value: T) => boolean): number {
    for (let i = this.length - 1; i >= 0; i--) {
        if (predicate(this[i])) return i;
    }
    return -1;
};

String.prototype.format = function(...args: string[]): string {
    return this.replace(/{(\d+)}/g, (match, num) => {
        return typeof args[num] !== 'undefined' ? args[num] : match;
    });
};

// Implémentation des méthodes de création d'éléments
if (typeof window !== 'undefined') {
    Node.prototype.createEl = function<K extends keyof HTMLElementTagNameMap>(
        tag: K,
        o?: DomElementInfo | string,
        callback?: (el: HTMLElementTagNameMap[K]) => void
    ): HTMLElementTagNameMap[K] {
        const el = document.createElement(tag);
        if (typeof o === 'string') {
            el.classList.add(o);
        } else if (o) {
            if (o.cls) {
                if (Array.isArray(o.cls)) {
                    el.classList.add(...o.cls);
                } else {
                    el.classList.add(o.cls);
                }
            }
            if (o.text) el.setText(o.text);
            if (o.attr) el.setAttrs(o.attr);
            if (o.title) el.setAttr('title', o.title);
            if (o.parent) {
                if (o.prepend && 'prepend' in o.parent) {
                    (o.parent as Element).prepend(el);
                } else {
                    o.parent.appendChild(el);
                }
            }
            if (o.value) el.setAttr('value', o.value);
            if (o.type) el.setAttr('type', o.type);
            if (o.placeholder) el.setAttr('placeholder', o.placeholder);
            if (o.href) el.setAttr('href', o.href);
        }
        callback?.(el);
        return el;
    };

    Node.prototype.createDiv = function(
        o?: DomElementInfo | string,
        callback?: (el: HTMLDivElement) => void
    ): HTMLDivElement {
        return this.createEl('div', o, callback);
    };

    Node.prototype.createSpan = function(
        o?: DomElementInfo | string,
        callback?: (el: HTMLSpanElement) => void
    ): HTMLSpanElement {
        return this.createEl('span', o, callback);
    };

    Node.prototype.createSvg = function<K extends keyof SVGElementTagNameMap>(
        tag: K,
        o?: SvgElementInfo | string,
        callback?: (el: SVGElementTagNameMap[K]) => void
    ): SVGElementTagNameMap[K] {
        const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
        if (typeof o === 'string') {
            el.classList.add(o);
        } else if (o) {
            if (o.cls) {
                if (Array.isArray(o.cls)) {
                    el.classList.add(...o.cls);
                } else {
                    el.classList.add(o.cls);
                }
            }
            if (o.attr) el.setAttrs(o.attr);
            if (o.parent) {
                if (o.prepend && 'prepend' in o.parent) {
                    (o.parent as Element).prepend(el);
                } else {
                    o.parent.appendChild(el);
                }
            }
        }
        callback?.(el);
        return el;
    };

    // Implémentation des méthodes d'événements manquantes
    HTMLElement.prototype.onClickEvent = function(
        this: HTMLElement,
        listener: (this: HTMLElement, ev: MouseEvent) => any,
        options?: boolean | AddEventListenerOptions
    ): void {
        this.addEventListener('click', listener, options);
    };

    HTMLElement.prototype.onNodeInserted = function(
        this: HTMLElement,
        listener: () => any,
        once = false
    ): () => void {
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

    HTMLElement.prototype.onWindowMigrated = function(
        this: HTMLElement,
        listener: (win: Window) => any
    ): () => void {
        const callback = () => listener(window);
        window.addEventListener('window-migrated', callback);
        return () => window.removeEventListener('window-migrated', callback);
    };
}

export const setupGlobalMocks = () => {
    // Cette fonction peut être appelée pour s'assurer que les mocks sont en place
    // Utile pour réinitialiser l'état entre les tests
}; 