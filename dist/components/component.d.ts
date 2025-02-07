import { Component as IComponent, Events, EventRef } from 'obsidian';
export declare class Component extends Events implements IComponent {
    protected children: IComponent[];
    protected domEventRefs: EventRef[];
    protected intervalIds: number[];
    protected registeredCallbacks: (() => any)[];
    load(): void;
    onload(): void;
    unload(): void;
    onunload(): void;
    addChild<T extends IComponent>(component: T): T;
    removeChild<T extends IComponent>(component: T): T;
    register(cb: () => any): void;
    registerDomEvent<K extends keyof WindowEventMap>(el: Window, type: K, callback: (this: HTMLElement, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    registerDomEvent<K extends keyof DocumentEventMap>(el: Document, type: K, callback: (this: HTMLElement, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    registerDomEvent<K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    registerInterval(id: number): number;
    registerEvent(eventRef: EventRef): void;
}
