import type { TFile, WorkspaceLeaf, App } from 'obsidian';
import { ItemView } from './item-view';
/**
 * File view mock
 * @public
 */
export declare abstract class FileView extends ItemView {
    allowNoFile: boolean;
    file: TFile | null;
    navigation: boolean;
    app: App;
    registerEvent: import("vitest/dist").Mock<any, any>;
    on: import("vitest/dist").Mock<any, any>;
    off: import("vitest/dist").Mock<any, any>;
    offref: import("vitest/dist").Mock<any, any>;
    trigger: import("vitest/dist").Mock<any, any>;
    tryTrigger: import("vitest/dist").Mock<any, any>;
    getDisplayText: import("vitest/dist").Mock<any, any>;
    onload: import("vitest/dist").Mock<any, any>;
    getState: import("vitest/dist").Mock<any, any>;
    constructor(leaf: WorkspaceLeaf);
    setState: import("vitest/dist").Mock<any, any>;
    onLoadFile: import("vitest/dist").Mock<any, any>;
    onUnloadFile: import("vitest/dist").Mock<any, any>;
    onRename: import("vitest/dist").Mock<any, any>;
    canAcceptExtension: import("vitest/dist").Mock<any, any>;
}
