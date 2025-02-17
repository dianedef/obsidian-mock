import { Plugin } from '../__mocks__/components/plugin';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Plugin', () => {
    let plugin: Plugin;

    beforeEach(() => {
        plugin = new Plugin();
    });

    it('should load correctly', () => {
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

    it('should create an instance with default properties', () => {
        expect(plugin.app).toBeDefined();
        expect(plugin.app.workspace).toBeDefined();
        expect(plugin.app.vault).toBeDefined();
        expect(plugin.app.metadataCache).toBeDefined();
    });

    it('should have a manifest with default values', () => {
        expect(plugin.manifest).toEqual({
            id: 'mock-plugin',
            name: 'Mock Plugin',
            version: '1.0.0',
            minAppVersion: '0.15.0',
            author: 'Mock Author',
            description: 'A mock plugin for testing'
        });
    });

    it('should allow loading settings', async () => {
        await plugin.loadSettings();
        expect(plugin.settings).toEqual({});
    });

    it('should allow registering commands', () => {
        const command = { id: 'test', name: 'Test Command' };
        plugin.addCommand(command);
        expect(plugin.addCommand).toHaveBeenCalledWith(command);
    });

    it('should allow registering events', () => {
        const callback = vi.fn();
        plugin.registerEvent(callback);
        expect(plugin.registerEvent).toHaveBeenCalledWith(callback);
    });

    it('should allow registering views', () => {
        const viewType = 'test-view';
        const viewCreator = vi.fn();
        plugin.registerView(viewType, viewCreator);
        expect(plugin.registerView).toHaveBeenCalledWith(viewType, viewCreator);
    });
}); 