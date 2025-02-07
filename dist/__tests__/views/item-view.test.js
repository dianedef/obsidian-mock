import { describe, it, expect, beforeEach } from 'vitest';
import { App } from '../../__mocks__/core/app';
import { ItemView } from '../../__mocks__/views/item-view';
import { WorkspaceLeaf } from '../../__mocks__/views/workspace-leaf';
import { WorkspaceTabs } from '../../__mocks__/core/workspace-items';
describe('ItemView', () => {
    let app;
    let parent;
    let leaf;
    let view;
    beforeEach(() => {
        app = new App();
        parent = new WorkspaceTabs(null);
        leaf = new WorkspaceLeaf(app, parent);
        view = new ItemView(leaf);
    });
    describe('Constructeur', () => {
        it('devrait initialiser correctement les propriétés de base', () => {
            expect(view.app).toBe(app);
            expect(view.leaf).toBe(leaf);
            expect(view.containerEl).toBeInstanceOf(HTMLElement);
            expect(view.contentEl).toBeInstanceOf(HTMLElement);
            expect(view.icon).toBe('document');
            expect(view.navigation).toBe(true);
            expect(view.scope).toBeDefined();
            expect(view.scope.register).toBeDefined();
            expect(view.scope.unregister).toBeDefined();
        });
        it('devrait ajouter contentEl à containerEl', () => {
            expect(view.containerEl.contains(view.contentEl)).toBe(true);
        });
    });
    describe('Méthodes de vue', () => {
        it('devrait avoir des méthodes getViewType et getDisplayText fonctionnelles', () => {
            expect(view.getViewType()).toBe('item-view');
            expect(view.getDisplayText()).toBe('Item View');
        });
        it('devrait avoir une méthode getIcon fonctionnelle', () => {
            expect(view.getIcon()).toBe('document');
        });
        it('devrait avoir des méthodes de gestion d\'état fonctionnelles', () => {
            const state = { test: 'value' };
            view.setState(state, { history: [] });
            expect(view.getState()).toEqual({});
            expect(view.getEphemeralState()).toEqual({});
        });
    });
    describe('Méthodes spécifiques', () => {
        it('devrait avoir une méthode addAction fonctionnelle', () => {
            const icon = 'test-icon';
            const title = 'Test Action';
            const callback = () => { };
            const action = view.addAction(icon, title, callback);
            expect(action).toBeInstanceOf(HTMLElement);
            expect(view.addAction).toHaveBeenCalledWith(icon, title, callback);
        });
        it('devrait avoir une méthode then fonctionnelle', () => {
            const resolve = () => { };
            const result = view.then(resolve);
            expect(result).toBe(view);
            expect(view.then).toHaveBeenCalledWith(resolve);
        });
    });
    describe('Méthodes de cycle de vie', () => {
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
            expect(result).toBe(0);
            expect(view.registerInterval).toHaveBeenCalledWith(interval);
        });
    });
});
