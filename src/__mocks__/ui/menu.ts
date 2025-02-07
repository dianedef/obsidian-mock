import { vi } from 'vitest';
import type { Menu as IMenu, MenuItem, MenuPositionDef, Component } from 'obsidian';

export class Menu implements IMenu {
    items: MenuItem[] = [];
    dom: HTMLElement;
    private hideCallback: (() => any) | null = null;
    private useNativeMenu: boolean = false;
    private children: Component[] = [];
    private events: { [key: string]: any[] } = {};

    constructor() {
        this.dom = document.createElement('div');
        this.dom.className = 'menu';
    }

    addItem(cb: (item: MenuItem) => any): this {
        const item: MenuItem = {
            setTitle: vi.fn().mockReturnThis(),
            setIcon: vi.fn().mockReturnThis(),
            setChecked: vi.fn().mockReturnThis(),
            setDisabled: vi.fn().mockReturnThis(),
            onClick: vi.fn().mockReturnThis(),
            setSection: vi.fn().mockReturnThis(),
            setIsLabel: vi.fn().mockReturnThis()
        };
        cb(item);
        this.items.push(item);
        return this;
    }

    addSeparator(): this {
        const separator = document.createElement('div');
        separator.className = 'menu-separator';
        this.dom.appendChild(separator);
        return this;
    }

    setNoIcon(): this {
        this.dom.classList.add('no-icon');
        return this;
    }

    setUseNativeMenu(useNative: boolean): this {
        this.useNativeMenu = useNative;
        return this;
    }

    showAtMouseEvent(event: MouseEvent): this {
        this.dom.style.left = event.clientX + 'px';
        this.dom.style.top = event.clientY + 'px';
        document.body.appendChild(this.dom);
        return this;
    }

    showAtPosition(position: MenuPositionDef, doc?: Document): this {
        const { x, y } = position;
        this.dom.style.left = x + 'px';
        this.dom.style.top = y + 'px';
        (doc || document).body.appendChild(this.dom);
        return this;
    }

    hide(): this {
        if (this.dom.parentElement) {
            this.dom.remove();
        }
        if (this.hideCallback) {
            this.hideCallback();
        }
        return this;
    }

    close(): this {
        return this.hide();
    }

    onHide(callback: () => any): void {
        this.hideCallback = callback;
    }

    load(): void {
        // No-op
    }

    onload(): void {
        // No-op
    }

    unload(): void {
        this.hide();
    }

    onunload(): void {
        // No-op
    }

    addChild<T extends Component>(component: T): T {
        this.children.push(component);
        return component;
    }

    removeChild<T extends Component>(component: T): T {
        const index = this.children.indexOf(component);
        if (index > -1) {
            this.children.splice(index, 1);
        }
        return component;
    }

    register(_cb: () => any): void {
        // No-op
    }

    registerEvent(_eventRef: any): void {
        // No-op
    }

    registerDomEvent<K extends keyof WindowEventMap>(el: Window, type: K, callback: (this: HTMLElement, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    registerDomEvent<K extends keyof DocumentEventMap>(el: Document, type: K, callback: (this: HTMLElement, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    registerDomEvent<K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, callback: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    registerDomEvent(el: any, type: string, callback: (this: HTMLElement, ev: any) => any, options?: boolean | AddEventListenerOptions): void {
        el.addEventListener(type, callback, options);
    }

    registerInterval(id: number): number {
        return id;
    }
}
