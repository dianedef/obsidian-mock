declare class View {
    app: any;
    icon: string;
    navigation: boolean;
    leaf: any;
    containerEl: HTMLElement;
    scope: any;
    constructor(leaf: any);
    onOpen(): Promise<void>;
    onClose(): Promise<void>;
    getViewType(): string;
    getDisplayText(): string;
    getIcon(): string;
    onResize(): void;
    onPaneMenu(_menu: any, _source: string): void;
    onHeaderMenu(_menu: any): void;
    getState(): any;
    setState(_state: any, _result: any): Promise<void>;
    getEphemeralState(): any;
    setEphemeralState(_state: any): void;
    load(): void;
    unload(): void;
    onload(): void;
    onunload(): void;
    addChild(child: any): any;
    removeChild(child: any): any;
    register(cb: () => any): void;
    registerEvent(_eventRef: any): void;
    registerDomEvent(_el: any, _type: string, _callback: any): void;
    registerInterval(id: number): number;
}
declare class ItemView extends View {
    contentEl: HTMLElement;
    constructor(leaf: any);
}
declare class MarkdownView extends View {
    editor: any;
    previewMode: any;
    currentMode: any;
    file: any;
    constructor(leaf: any);
    getViewType(): string;
}
declare const obsidian: {
    View: typeof View;
    ItemView: typeof ItemView;
    MarkdownView: typeof MarkdownView;
};
export default obsidian;
