import { App } from '../core/app';
import type { Plugin as IPlugin } from 'obsidian';
export declare class Plugin implements IPlugin {
    app: App;
    manifest: {
        id: string;
        name: string;
        version: string;
        minAppVersion: string;
        author: string;
        description: string;
    };
    settings: {};
    constructor();
    addCommand: import("vitest/dist").Mock<any, any>;
    addRibbonIcon: import("vitest/dist").Mock<any, any>;
    addSettingTab: import("vitest/dist").Mock<any, any>;
    addStatusBarItem: import("vitest/dist").Mock<any, any>;
    registerView: import("vitest/dist").Mock<any, any>;
    registerExtensions: import("vitest/dist").Mock<any, any>;
    registerMarkdownPostProcessor: import("vitest/dist").Mock<any, any>;
    registerMarkdownCodeBlockProcessor: import("vitest/dist").Mock<any, any>;
    registerCodeMirror: import("vitest/dist").Mock<any, any>;
    registerEditorExtension: import("vitest/dist").Mock<any, any>;
    registerObsidianProtocolHandler: import("vitest/dist").Mock<any, any>;
    registerEvent: import("vitest/dist").Mock<any, any>;
    registerDomEvent: import("vitest/dist").Mock<any, any>;
    registerInterval: import("vitest/dist").Mock<any, any>;
    loadSettings: import("vitest/dist").Mock<any, any>;
    saveSettings: import("vitest/dist").Mock<any, any>;
    saveData: import("vitest/dist").Mock<any, any>;
    loadData: import("vitest/dist").Mock<any, any>;
    load: import("vitest/dist").Mock<any, any>;
    onload: import("vitest/dist").Mock<any, any>;
    unload: import("vitest/dist").Mock<any, any>;
    onunload: import("vitest/dist").Mock<any, any>;
}
