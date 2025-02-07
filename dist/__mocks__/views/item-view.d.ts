import type { WorkspaceLeaf, Scope } from 'obsidian';
import { View } from './view';
import { ItemView as IItemView } from 'obsidian';
declare global {
    interface HTMLElement {
        addClass(className: string): void;
        removeClass(className: string): void;
        toggleClass(className: string): void;
        detach(): void;
    }
}
export declare class ItemView extends View implements IItemView {
    containerEl: HTMLElement;
    contentEl: HTMLElement;
    scope: Scope;
    icon: string;
    navigation: boolean;
    constructor(leaf: WorkspaceLeaf);
    onOpen: import("vitest/dist").Mock<any, any>;
    onClose: import("vitest/dist").Mock<any, any>;
    getViewType: import("vitest/dist").Mock<any, any>;
    getDisplayText: import("vitest/dist").Mock<any, any>;
    getIcon: import("vitest/dist").Mock<any, any>;
    onResize: import("vitest/dist").Mock<any, any>;
    getState: import("vitest/dist").Mock<any, any>;
    setState: import("vitest/dist").Mock<any, any>;
    getEphemeralState: import("vitest/dist").Mock<any, any>;
    setEphemeralState: import("vitest/dist").Mock<any, any>;
    onPaneMenu: import("vitest/dist").Mock<any, any>;
    onHeaderMenu: import("vitest/dist").Mock<any, any>;
    load: import("vitest/dist").Mock<any, any>;
    onload: import("vitest/dist").Mock<any, any>;
    unload: import("vitest/dist").Mock<any, any>;
    onunload: import("vitest/dist").Mock<any, any>;
    registerEvent: import("vitest/dist").Mock<any, any>;
    registerDomEvent: import("vitest/dist").Mock<any, any>;
    registerInterval: import("vitest/dist").Mock<any, any>;
    addAction: import("vitest/dist").Mock<any, any>;
    then: import("vitest/dist").Mock<any, any>;
    addChild: import("vitest/dist").Mock<any, any>;
    removeChild: import("vitest/dist").Mock<any, any>;
    register: import("vitest/dist").Mock<any, any>;
}
