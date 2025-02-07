import type { WorkspaceLeaf as ObsidianWorkspaceLeaf, ViewState, WorkspaceTabs, WorkspaceMobileDrawer, View } from 'obsidian';
import { App } from '../obsidian';
export declare class WorkspaceLeaf implements ObsidianWorkspaceLeaf {
    containerEl: HTMLElement;
    tabHeaderEl: HTMLElement;
    tabHeaderInnerTitleEl: HTMLElement;
    tabHeaderInnerIconEl: HTMLElement;
    view: View;
    app: App;
    parent: WorkspaceTabs | WorkspaceMobileDrawer;
    width: number;
    height: number;
    working: boolean;
    private _pinned;
    private _group;
    private _isDeferred;
    constructor(app: App, parent: WorkspaceTabs | WorkspaceMobileDrawer);
    getViewState(): ViewState;
    setViewState: import("vitest/dist").Mock<any, any>;
    open(view: View): Promise<View>;
    getRoot(): WorkspaceLeaf;
    getContainer(): any;
    getEphemeralState: import("vitest/dist").Mock<any, any>;
    setEphemeralState: import("vitest/dist").Mock<any, any>;
    openFile: import("vitest/dist").Mock<any, any>;
    detach: import("vitest/dist").Mock<any, any>;
    togglePinned: import("vitest/dist").Mock<any, any>;
    setPinned: import("vitest/dist").Mock<any, any>;
    setGroupMember: import("vitest/dist").Mock<any, any>;
    setGroup: import("vitest/dist").Mock<any, any>;
    getDisplayText: import("vitest/dist").Mock<any, any>;
    getIcon: import("vitest/dist").Mock<any, any>;
    onResize: import("vitest/dist").Mock<any, any>;
    setDimensions: import("vitest/dist").Mock<any, any>;
    load: import("vitest/dist").Mock<any, any>;
    onload: import("vitest/dist").Mock<any, any>;
    unload: import("vitest/dist").Mock<any, any>;
    onunload: import("vitest/dist").Mock<any, any>;
    get isDeferred(): boolean;
    loadIfDeferred: import("vitest/dist").Mock<any, any>;
    on: import("vitest/dist").Mock<any, any>;
    off: import("vitest/dist").Mock<any, any>;
    offref: import("vitest/dist").Mock<any, any>;
    trigger: import("vitest/dist").Mock<any, any>;
    tryTrigger: import("vitest/dist").Mock<any, any>;
}
