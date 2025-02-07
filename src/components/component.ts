import { Component as IComponent, Events, EventRef } from 'obsidian';

export class Component extends Events implements IComponent {
    protected children: IComponent[] = [];
    protected domEventRefs: EventRef[] = [];
    protected intervalIds: number[] = [];
    protected registeredCallbacks: (() => any)[] = [];

    load(): void {}
    onload(): void {}
    unload(): void {
        // Clean up event listeners
        this.domEventRefs.forEach(ref => {
            if (ref && typeof ref === 'object' && 'detach' in ref && typeof ref.detach === 'function') {
                ref.detach();
            }
        });
        this.domEventRefs = [];

        // Clear intervals
        this.intervalIds.forEach(id => window.clearInterval(id));
        this.intervalIds = [];

        // Clear registered callbacks
        this.registeredCallbacks.forEach(cb => cb());
        this.registeredCallbacks = [];

        // Unload children
        this.children.forEach(child => child.unload());
        this.children = [];
    }
    onunload(): void {}

    addChild<T extends IComponent>(component: T): T {
        this.children.push(component);
        return component;
    }

    removeChild<T extends IComponent>(component: T): T {
        const index = this.children.indexOf(component);
        if (index > -1) {
            this.children.splice(index, 1);
        }
        return component;
    }

    register(cb: () => any): void {
        this.registeredCallbacks.push(cb);
    }

    registerDomEvent<K extends keyof WindowEventMap>(
        el: Window,
        type: K,
        callback: (this: HTMLElement, ev: WindowEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    registerDomEvent<K extends keyof DocumentEventMap>(
        el: Document,
        type: K,
        callback: (this: HTMLElement, ev: DocumentEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    registerDomEvent<K extends keyof HTMLElementEventMap>(
        el: HTMLElement,
        type: K,
        callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void;
    registerDomEvent(
        el: Window | Document | HTMLElement,
        type: string,
        callback: (this: HTMLElement, ev: Event) => any,
        options?: boolean | AddEventListenerOptions
    ): void {
        el.addEventListener(type, callback, options);
        this.domEventRefs.push({
            detach: () => el.removeEventListener(type, callback, options)
        });
    }

    registerInterval(id: number): number {
        this.intervalIds.push(id);
        return id;
    }

    registerEvent(eventRef: EventRef): void {
        if (eventRef) {
            this.domEventRefs.push(eventRef);
        }
    }
} 
