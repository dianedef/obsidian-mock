import { vi } from 'vitest';
export class Menu {
    constructor() {
        this.items = [];
        this.hideCallback = null;
        this.useNativeMenu = false;
        this.children = [];
        this.events = {};
        this.dom = document.createElement('div');
        this.dom.className = 'menu';
    }
    addItem(cb) {
        const item = {
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
    addSeparator() {
        const separator = document.createElement('div');
        separator.className = 'menu-separator';
        this.dom.appendChild(separator);
        return this;
    }
    setNoIcon() {
        this.dom.classList.add('no-icon');
        return this;
    }
    setUseNativeMenu(useNative) {
        this.useNativeMenu = useNative;
        return this;
    }
    showAtMouseEvent(event) {
        this.dom.style.left = event.clientX + 'px';
        this.dom.style.top = event.clientY + 'px';
        document.body.appendChild(this.dom);
        return this;
    }
    showAtPosition(position, doc) {
        const { x, y } = position;
        this.dom.style.left = x + 'px';
        this.dom.style.top = y + 'px';
        (doc || document).body.appendChild(this.dom);
        return this;
    }
    hide() {
        if (this.dom.parentElement) {
            this.dom.remove();
        }
        if (this.hideCallback) {
            this.hideCallback();
        }
        return this;
    }
    close() {
        return this.hide();
    }
    onHide(callback) {
        this.hideCallback = callback;
    }
    load() {
        // No-op
    }
    onload() {
        // No-op
    }
    unload() {
        this.hide();
    }
    onunload() {
        // No-op
    }
    addChild(component) {
        this.children.push(component);
        return component;
    }
    removeChild(component) {
        const index = this.children.indexOf(component);
        if (index > -1) {
            this.children.splice(index, 1);
        }
        return component;
    }
    register(_cb) {
        // No-op
    }
    registerEvent(_eventRef) {
        // No-op
    }
    registerDomEvent(el, type, callback, options) {
        el.addEventListener(type, callback, options);
    }
    registerInterval(id) {
        return id;
    }
}
