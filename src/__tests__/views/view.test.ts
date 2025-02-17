import { describe, it, expect, beforeEach, vi } from 'vitest';
import { App as AppImpl } from '../../__mocks__/core/app';
import { View } from '../../__mocks__/core/view';
import { WorkspaceLeaf } from '../../__mocks__/views/workspace-leaf';
import { WorkspaceTabs } from '../../__mocks__/core/workspace-items';
import type { App } from 'obsidian';

// Test class that exposes protected methods
class TestView extends View {
    public async testOnOpen(): Promise<void> {
        return this.onOpen();
    }

    public async testOnClose(): Promise<void> {
        return this.onClose();
    }
}

describe('View', () => {
    let app: App;
    let parent: WorkspaceTabs;
    let leaf: WorkspaceLeaf;
    let view: TestView;

    beforeEach(() => {
        app = new AppImpl();
        parent = new WorkspaceTabs(null);
        leaf = new WorkspaceLeaf(app, parent);
        view = new TestView(leaf);
    });

    describe('Constructor', () => {
        it('should correctly initialize base properties', () => {
            expect(view.app).toBe(app);
            expect(view.leaf).toBe(leaf);
            expect(view.containerEl).toBeInstanceOf(HTMLElement);
            expect(view.icon).toBe('');
            expect(view.navigation).toBe(false);
            expect(view.scope).toBeDefined();
            expect(view.scope.register).toBeDefined();
            expect(view.scope.unregister).toBeDefined();
        });
    });

    describe('View methods', () => {
        it('should have functional getViewType and getDisplayText methods', () => {
            expect(view.getViewType()).toBe('view');
            expect(view.getDisplayText()).toBe('View');
        });

        it('should have a functional getIcon method', () => {
            view.icon = 'test-icon';
            expect(view.getIcon()).toBe('test-icon');
        });

        it('should have functional state management methods', () => {
            const state = { test: 'value' };
            const result = { history: true };
            view.setState(state, result);
            expect(view.setState).toHaveBeenCalledWith(state, result);
            expect(view.getState()).toEqual({});
            expect(view.getEphemeralState()).toEqual({});
        });
    });

    describe('Lifecycle methods', () => {
        it('should call onOpen and onClose', async () => {
            await view.testOnOpen();
            expect(view.onOpen).toHaveBeenCalled();

            await view.testOnClose();
            expect(view.onClose).toHaveBeenCalled();
        });

        it('should have functional lifecycle methods', async () => {
            await view.onOpen();
            expect(view.onOpen).toHaveBeenCalled();

            await view.onClose();
            expect(view.onClose).toHaveBeenCalled();

            view.load();
            expect(view.load).toHaveBeenCalled();

            view.unload();
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
            expect(result).toBe(interval);
            expect(view.registerInterval).toHaveBeenCalledWith(interval);
        });
    });
}); 