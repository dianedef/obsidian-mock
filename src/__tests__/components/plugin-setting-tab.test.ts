import { describe, it, expect, beforeEach } from 'vitest';
import { App } from '../../__mocks__/core/app';
import { Plugin } from '../../__mocks__/plugin';
import { PluginSettingTab, Setting } from '../../__mocks__/components/plugin-setting-tab';

describe('PluginSettingTab', () => {
    let app: App;
    let plugin: Plugin;
    let settingTab: PluginSettingTab;

    beforeEach(() => {
        app = new App();
        plugin = new Plugin(app, {
            id: 'test',
            name: 'Test Plugin',
            version: '1.0.0',
            minAppVersion: '0.15.0',
            description: 'Test plugin description',
            author: 'Test Author'
        });
        settingTab = new PluginSettingTab(app, plugin);
    });

    it('should create a setting tab with container', () => {
        expect(settingTab.containerEl).toBeDefined();
        expect(settingTab.containerEl.hasClass('settings-tab-container')).toBe(true);
    });

    it('should add settings', () => {
        const setting = settingTab.addSetting(s => {
            s.setName('Test Setting')
             .setDesc('Test Description');
        });

        expect(settingTab.getSettings()).toHaveLength(1);
        expect(setting.nameEl.getText()).toBe('Test Setting');
        expect(setting.descEl.getText()).toBe('Test Description');
    });

    describe('Setting Components', () => {
        let setting: Setting;

        beforeEach(() => {
            setting = settingTab.addSetting(s => s);
        });

        it('should add text input', () => {
            setting.addText(text => {
                text.setValue('test value');
            });

            const components = setting.getComponents();
            expect(components).toHaveLength(1);
            expect(components[0].tagName.toLowerCase()).toBe('input');
            expect((components[0] as HTMLInputElement).type).toBe('text');
            expect((components[0] as HTMLInputElement).value).toBe('test value');
        });

        it('should add textarea', () => {
            setting.addTextArea(text => {
                text.setValue('test value');
            });

            const components = setting.getComponents();
            expect(components).toHaveLength(1);
            expect(components[0].tagName.toLowerCase()).toBe('textarea');
            expect((components[0] as HTMLTextAreaElement).value).toBe('test value');
        });

        it('should add toggle', () => {
            setting.addToggle(toggle => {
                toggle.setValue(true);
            });

            const components = setting.getComponents();
            expect(components).toHaveLength(1);
            expect(components[0].tagName.toLowerCase()).toBe('input');
            expect((components[0] as HTMLInputElement).type).toBe('checkbox');
            expect((components[0] as HTMLInputElement).checked).toBe(true);
        });

        it('should add dropdown', () => {
            setting.addDropdown(dropdown => {
                dropdown.addOption('test', 'Test Option');
                dropdown.setValue('test');
            });

            const components = setting.getComponents();
            expect(components).toHaveLength(1);
            expect(components[0].tagName.toLowerCase()).toBe('select');
            expect((components[0] as HTMLSelectElement).value).toBe('test');
        });

        it('should add button', () => {
            let clicked = false;
            setting.addButton(button => {
                button.setButtonText('Test Button');
                button.onClick(() => clicked = true);
            });

            const components = setting.getComponents();
            expect(components).toHaveLength(1);
            expect(components[0].tagName.toLowerCase()).toBe('button');
            expect(components[0].textContent).toBe('Test Button');

            (components[0] as HTMLButtonElement).click();
            expect(clicked).toBe(true);
        });
    });

    it('should clear settings on hide', () => {
        settingTab.addSetting(s => s);
        expect(settingTab.getSettings()).toHaveLength(1);

        settingTab.hide();
        expect(settingTab.getSettings()).toHaveLength(0);
    });
}); 