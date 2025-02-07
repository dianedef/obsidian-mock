import { Plugin } from '../__mocks__/components/plugin';
import { describe, it, expect, beforeEach, vi } from 'vitest';
describe('Plugin', () => {
    let plugin;
    beforeEach(() => {
        plugin = new Plugin();
    });
    it('devrait charger correctement', () => {
        const manifest = {
            id: 'test-plugin',
            name: 'Test Plugin',
            version: '1.0.0',
            minAppVersion: '0.15.0',
            author: 'Test Author',
            description: 'A test plugin'
        };
        plugin.load();
        expect(plugin.manifest).toEqual(manifest);
    });
    it('devrait créer une instance avec les propriétés par défaut', () => {
        expect(plugin.app).toBeDefined();
        expect(plugin.app.workspace).toBeDefined();
        expect(plugin.app.vault).toBeDefined();
        expect(plugin.app.metadataCache).toBeDefined();
    });
    it('devrait avoir un manifest avec les valeurs par défaut', () => {
        expect(plugin.manifest).toEqual({
            id: 'mock-plugin',
            name: 'Mock Plugin',
            version: '1.0.0',
            minAppVersion: '0.15.0',
            author: 'Mock Author',
            description: 'A mock plugin for testing'
        });
    });
    it('devrait permettre de charger les paramètres', async () => {
        await plugin.loadSettings();
        expect(plugin.settings).toEqual({});
    });
    it('devrait permettre d\'enregistrer des commandes', () => {
        const command = { id: 'test', name: 'Test Command' };
        plugin.addCommand(command);
        expect(plugin.addCommand).toHaveBeenCalledWith(command);
    });
    it('devrait permettre d\'enregistrer des événements', () => {
        const callback = vi.fn();
        plugin.registerEvent(callback);
        expect(plugin.registerEvent).toHaveBeenCalledWith(callback);
    });
    it('devrait permettre d\'enregistrer des vues', () => {
        const viewType = 'test-view';
        const viewCreator = vi.fn();
        plugin.registerView(viewType, viewCreator);
        expect(plugin.registerView).toHaveBeenCalledWith(viewType, viewCreator);
    });
});
