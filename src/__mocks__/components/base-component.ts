import { vi } from 'vitest';
import { Events } from './events';
import type { DomElementInfo } from '../../types/base';
import type { IEventRef } from './events';

/** @public */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

/** @public */
export function arrayBufferToHex(data: ArrayBuffer): string {
    const bytes = new Uint8Array(data);
    return Array.from(bytes)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

/** @public */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * @public
 */
export class BaseComponent extends Events {
    protected containerEl: HTMLElement;
    protected disabled: boolean = false;
    protected cleanupFunctions: Array<() => void> = [];
    protected domEventRefs: Array<{ element: HTMLElement, event: string, callback: (evt: Event) => void }> = [];
    protected intervalIds: number[] = [];
    protected isLoaded: boolean = false;
    protected id: string;

    constructor() {
        super();
        this.containerEl = document.createElement('div');
        this.id = Math.random().toString(36).substring(7);
    }

    load(): void {
        if (this.isLoaded) return;
        this.isLoaded = true;
        this.onload();
        this.trigger('load');
    }

    unload(): void {
        if (!this.isLoaded) return;

        // Call onunload first
        this.onunload();

        // Trigger unload event
        this.trigger('unload');

        // Run cleanup functions
        while (this.cleanupFunctions.length) {
            try {
                this.cleanupFunctions.pop()?.();
            } catch (e) {
                console.error('Error during cleanup:', e);
            }
        }

        // Clean up DOM events
        while (this.domEventRefs.length) {
            const ref = this.domEventRefs.pop();
            if (ref) {
                try {
                    ref.element.removeEventListener(ref.event, ref.callback);
                } catch (e) {
                    console.error('Error removing event listener:', e);
                }
            }
        }

        // Clear intervals
        while (this.intervalIds.length) {
            try {
                window.clearInterval(this.intervalIds.pop());
            } catch (e) {
                console.error('Error clearing interval:', e);
            }
        }

        // Clean up DOM elements
        try {
            // Trouver tous les éléments créés par ce composant
            const elements = document.querySelectorAll(`[data-component-id="${this.id}"]`);
            elements.forEach(el => {
                if (el instanceof HTMLElement && el.parentNode) {
                    el.parentNode.removeChild(el);
                }
            });

            // Supprimer le conteneur s'il a un parent
            if (this.containerEl.parentNode) {
                this.containerEl.parentNode.removeChild(this.containerEl);
            }
        } catch (e) {
            console.error('Error cleaning up DOM elements:', e);
        }

        // Remove all event listeners
        this.events.clear();

        this.isLoaded = false;
    }

    register(cb: () => void): void {
        if (!this.isLoaded) {
            this.load();
        }
        this.cleanupFunctions.push(cb);
    }

    registerDomEvent(element: HTMLElement, event: string, callback: (evt: Event) => void): void {
        if (!this.isLoaded) {
            this.load();
        }
        const wrappedCallback = (evt: Event) => {
            if (!this.isLoaded) return;
            callback.call(this, evt);
        };
        element.addEventListener(event, wrappedCallback);
        this.domEventRefs.push({ element, event, callback: wrappedCallback });
    }

    registerInterval(callback: number | (() => void), delay: number = 1000): number {
        if (!this.isLoaded) {
            this.load();
        }

        let id: number;

        // Si callback est un ID d'intervalle, on l'ajoute simplement
        if (typeof callback === 'number') {
            id = callback;
        } else {
            // Sinon, on crée un nouvel intervalle
            const wrappedCallback = () => {
                if (!this.isLoaded) {
                    window.clearInterval(id);
                    return;
                }
                callback();
            };
            id = window.setInterval(wrappedCallback, delay);
        }

        this.intervalIds.push(id);
        return id;
    }

    setDisabled(disabled: boolean): this {
        this.disabled = disabled;
        this.toggleClass(this.containerEl, 'is-disabled', disabled);
        return this;
    }

    isDisabled(): boolean {
        return this.disabled;
    }

    then(callback: (component: this) => void): this {
        callback(this);
        return this;
    }

    protected onload(): void {
        // Override in subclass
    }

    protected onunload(): void {
        // Override in subclass
    }

    createEl<K extends keyof HTMLElementTagNameMap>(
        tag: K,
        attrs?: Partial<DomElementInfo>
    ): HTMLElementTagNameMap[K] {
        const el = document.createElement(tag);
        
        // Add component ID to track elements
        el.setAttribute('data-component-id', this.id);
        
        if (attrs) {
            if (attrs.cls) {
                el.className = Array.isArray(attrs.cls) ? attrs.cls.join(' ') : attrs.cls;
            }
            if (attrs.text) {
                el.textContent = String(attrs.text);
            }
            if (attrs.attr) {
                Object.entries(attrs.attr).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        el.setAttribute(key, String(value));
                    }
                });
            }
            if (attrs.parent) {
                attrs.parent.appendChild(el);
            } else {
                this.containerEl.appendChild(el);
            }
        } else {
            this.containerEl.appendChild(el);
        }

        // Garder une référence à l'élément pour le nettoyage
        this.register(() => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });

        return el;
    }

    toggleClass(el: HTMLElement, className: string, value: boolean): void {
        if (value) {
            el.classList.add(className);
        } else {
            el.classList.remove(className);
        }
    }

    setStyle(el: HTMLElement, styles: Partial<CSSStyleDeclaration>): void {
        Object.assign(el.style, styles);
    }

    appendChildren(parent: HTMLElement, children: HTMLElement[]): void {
        children.forEach(child => {
            if (child instanceof HTMLElement) {
                parent.appendChild(child);
            }
        });
    }

    // Override Events methods to handle component lifecycle
    on(name: string, callback: Function, ctx?: any): IEventRef {
        if (!this.isLoaded) {
            this.load();
        }
        return super.on(name, callback, ctx);
    }

    off(name: string, callback: Function): void {
        super.off(name, callback);
    }

    once(name: string, callback: Function): IEventRef {
        if (!this.isLoaded) {
            this.load();
        }
        const wrappedCallback = (...args: any[]) => {
            try {
                callback.apply(this, args);
            } finally {
                this.off(name, wrappedCallback);
            }
        };
        return this.on(name, wrappedCallback);
    }

    trigger(name: string, ...args: any[]): void {
        super.trigger(name, ...args);
    }
} 