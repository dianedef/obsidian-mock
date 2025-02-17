import { describe, it, expect, beforeEach, vi } from 'vitest';
import { App } from '../../__mocks__/core/app';
import { ItemView } from '../../__mocks__/views/item-view';
import { WorkspaceLeaf } from '../../__mocks__/core/workspace-leaf';
import { WorkspaceTabs } from '../../__mocks__/core/workspace-items';

interface ViewEvent {
    isVisible?: boolean;
    path?: string;
}

describe('ItemView', () => {
    let app: App;
    let parent: WorkspaceTabs;
    let leaf: WorkspaceLeaf;
    let view: ItemView;

    beforeEach(() => {
        app = new App();
        parent = new WorkspaceTabs(null, app);
        leaf = new WorkspaceLeaf(app, parent);
        view = new ItemView(leaf);
    });

    describe('Constructor', () => {
        it('should correctly initialize base properties', () => {
            expect(view.app).toBe(app);
            expect(view.leaf).toBe(leaf);
            expect(view.containerEl).toBeInstanceOf(HTMLElement);
            expect(view.icon).toBe('document');
            expect(view.navigation).toBe(true);
            expect(view.scope).toBeDefined();
            expect(view.scope.register).toBeDefined();
            expect(view.scope.unregister).toBeDefined();
        });

        it('should add contentEl to containerEl', () => {
            expect(view.containerEl.contains(view.contentEl)).toBe(true);
        });
    });

    describe('View methods', () => {
        it('should have functional getViewType and getDisplayText methods', () => {
            expect(view.getViewType()).toBe('item-view');
            expect(view.getDisplayText()).toBe('Item View');
        });

        it('should have a functional getIcon method', () => {
            expect(view.getIcon()).toBe('document');
        });

        it('should have functional state management methods', () => {
            const state = { test: 'value' };
            view.setState(state, { history: [] });
            expect(view.getState()).toEqual({});
            expect(view.getEphemeralState()).toEqual({});
        });
    });

    describe('Specific methods', () => {
        it('should have a functional addAction method', () => {
            const icon = 'test-icon';
            const title = 'Test Action';
            const callback = () => {};
            
            const action = view.addAction(icon, title, callback);
            expect(action).toBeInstanceOf(HTMLElement);
            expect(view.addAction).toHaveBeenCalledWith(icon, title, callback);
        });

        it('should have a functional then method', () => {
            const resolve = () => {};
            const result = view.then(resolve);
            expect(result).toBe(view);
            expect(view.then).toHaveBeenCalledWith(resolve);
        });
    });

    describe('Lifecycle methods', () => {
        it('should have functional lifecycle methods', async () => {
            await view.load();
            expect(view.load).toHaveBeenCalled();

            await view.unload();
            expect(view.unload).toHaveBeenCalled();

            view.onload();
            expect(view.onload).toHaveBeenCalled();

            view.onunload();
            expect(view.onunload).toHaveBeenCalled();
        });
    });

    describe('Component methods', () => {
        it('should have functional child management methods', () => {
            const child = { type: 'test-child' };
            const result = view.addChild(child);
            expect(result).toBe(child);
            expect(view.addChild).toHaveBeenCalledWith(child);

            const removed = view.removeChild(child);
            expect(removed).toBe(child);
            expect(view.removeChild).toHaveBeenCalledWith(child);
        });

        it('should have functional registration methods', () => {
            const callback = () => {};
            view.register(callback);
            expect(view.register).toHaveBeenCalledWith(callback);

            const event = { type: 'test-event' };
            view.registerEvent(event);
            expect(view.registerEvent).toHaveBeenCalledWith(event);

            const element = document.createElement('div');
            const type = 'click';
            const handler = () => {};
            view.registerDomEvent(element, type, handler);
            expect(view.registerDomEvent).toHaveBeenCalledWith(element, type, handler);

            const interval = 1000;
            const result = view.registerInterval(interval);
            expect(result).toBe(0);
            expect(view.registerInterval).toHaveBeenCalledWith(interval);
        });
    });

    describe('DOM management', () => {
        it('should be able to create elements with attributes', () => {
            const el = document.createElement('div');
            el.className = 'test-class';
            el.setAttribute('data-test', 'value');
            el.textContent = 'Test content';
            view.containerEl.appendChild(el);

            expect(el.classList.contains('test-class')).toBe(true);
            expect(el.getAttribute('data-test')).toBe('value');
            expect(el.textContent).toBe('Test content');
        });

        it('should be able to manipulate element hierarchy', () => {
            const parent = document.createElement('div');
            const child1 = document.createElement('span');
            const child2 = document.createElement('span');

            parent.appendChild(child1);
            parent.appendChild(child2);
            
            expect(parent.children.length).toBe(2);
            expect(parent.contains(child1)).toBe(true);
            expect(parent.contains(child2)).toBe(true);
        });

        it('should be able to dynamically manage styles', () => {
            const el = document.createElement('div');
            Object.assign(el.style, {
                backgroundColor: 'red',
                fontSize: '16px',
                display: 'flex'
            });

            expect(el.style.backgroundColor).toBe('red');
            expect(el.style.fontSize).toBe('16px');
            expect(el.style.display).toBe('flex');
        });
    });
}); 