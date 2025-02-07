import { describe, it, expect, beforeEach } from 'vitest';
import { App as AppImpl } from '../../__mocks__/core/app';
import { View } from '../../__mocks__/views/view';
import { WorkspaceLeaf } from '../../__mocks__/views/workspace-leaf';
import { WorkspaceTabs } from '../../__mocks__/core/workspace-items';
// Classe de test qui expose les méthodes protégées
class TestView extends View {
    async testOnOpen() {
        return this.onOpen();
    }
    async testOnClose() {
        return this.onClose();
    }
}
describe('View', () => {
    let app;
    let parent;
    let leaf;
    let view;
    beforeEach(() => {
        app = new AppImpl();
        parent = new WorkspaceTabs(null);
        leaf = new WorkspaceLeaf(app, parent);
        view = new TestView(leaf);
    });
    describe('Constructeur', () => {
        it('devrait initialiser correctement les propriétés de base', () => {
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
    describe('Méthodes de vue', () => {
        it('devrait avoir des méthodes getViewType et getDisplayText fonctionnelles', () => {
            expect(view.getViewType()).toBe('view');
            expect(view.getDisplayText()).toBe('View');
        });
        it('devrait avoir une méthode getIcon fonctionnelle', () => {
            view.icon = 'test-icon';
            expect(view.getIcon()).toBe('test-icon');
        });
        it('devrait avoir des méthodes de gestion d\'état fonctionnelles', () => {
            const state = { test: 'value' };
            const result = { history: true };
            view.setState(state, result);
            expect(view.setState).toHaveBeenCalledWith(state, result);
            expect(view.getState()).toEqual({});
            expect(view.getEphemeralState()).toEqual({});
        });
    });
    describe('Méthodes de cycle de vie', () => {
        it('devrait appeler onOpen et onClose', async () => {
            await view.testOnOpen();
            expect(view.onOpen).toHaveBeenCalled();
            await view.testOnClose();
            expect(view.onClose).toHaveBeenCalled();
        });
        it('devrait avoir des méthodes de cycle de vie fonctionnelles', async () => {
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
    describe('Méthodes de composant', () => {
        it('devrait avoir des méthodes de gestion des enfants fonctionnelles', () => {
            const child = { type: 'test-child' };
            const result = view.addChild(child);
            expect(result).toBe(child);
            expect(view.addChild).toHaveBeenCalledWith(child);
            const removed = view.removeChild(child);
            expect(removed).toBe(child);
            expect(view.removeChild).toHaveBeenCalledWith(child);
        });
        it('devrait avoir des méthodes d\'enregistrement fonctionnelles', () => {
            const callback = () => { };
            view.register(callback);
            expect(view.register).toHaveBeenCalledWith(callback);
            const event = { type: 'test-event' };
            view.registerEvent(event);
            expect(view.registerEvent).toHaveBeenCalledWith(event);
            const element = document.createElement('div');
            const type = 'click';
            const handler = () => { };
            view.registerDomEvent(element, type, handler);
            expect(view.registerDomEvent).toHaveBeenCalledWith(element, type, handler);
            const interval = 1000;
            const result = view.registerInterval(interval);
            expect(result).toBe(interval);
            expect(view.registerInterval).toHaveBeenCalledWith(interval);
        });
    });
});
