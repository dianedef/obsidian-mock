import type { App, Command, EditorSuggest, HoverLinkSource, MarkdownPostProcessor, ObsidianProtocolHandler, PluginManifest, PluginSettingTab, ViewCreator } from 'obsidian';
import { MockComponent } from './components/component';
export declare class MockPlugin extends MockComponent {
    app: App;
    manifest: PluginManifest;
    constructor(app: App, manifest: PluginManifest);
    addRibbonIcon: import("vitest/dist").Mock<[icon: string, title: string, callback: (evt: MouseEvent) => any], HTMLElement>;
    addStatusBarItem: import("vitest/dist").Mock<[], HTMLElement>;
    addCommand: import("vitest/dist").Mock<[command: Command], Command>;
    removeCommand: import("vitest/dist").Mock<[commandId: string], void>;
    addSettingTab: import("vitest/dist").Mock<[settingTab: PluginSettingTab], void>;
    registerView: import("vitest/dist").Mock<[type: string, viewCreator: ViewCreator], void>;
    registerHoverLinkSource: import("vitest/dist").Mock<[_id: string, _info: HoverLinkSource], void>;
    registerExtensions: import("vitest/dist").Mock<[_extensions: string[], _viewType: string], void>;
    registerMarkdownPostProcessor: import("vitest/dist").Mock<[postProcessor: MarkdownPostProcessor, _sortOrder?: number | undefined], MarkdownPostProcessor>;
    registerMarkdownCodeBlockProcessor: import("vitest/dist").Mock<[language: string, handler: (source: string, el: HTMLElement, ctx: any) => Promise<any> | void, sortOrder?: number | undefined], MarkdownPostProcessor>;
    registerEditorExtension: import("vitest/dist").Mock<[_extension: any], void>;
    registerObsidianProtocolHandler: import("vitest/dist").Mock<[_action: string, _handler: ObsidianProtocolHandler], void>;
    registerEditorSuggest: import("vitest/dist").Mock<[_editorSuggest: EditorSuggest<any>], void>;
    loadData: import("vitest/dist").Mock<[], Promise<any>>;
    saveData: import("vitest/dist").Mock<[_data: any], Promise<void>>;
    onUserEnable(): void;
    onExternalSettingsChange(): void;
}
