import type { TFile, WorkspaceLeaf, App } from 'obsidian';
import { EditableFileView } from './editable-file-view.d';
/**
 * This class implements an editable text file view that can be loaded and saved with an editor.
 * @public
 */
export declare abstract class TextFileView extends EditableFileView {
    data: string;
    file: TFile | null;
    app: App;
    constructor(leaf: WorkspaceLeaf);
    requestSave: import("vitest/dist").Mock<any, any>;
    onUnloadFile: import("vitest/dist").Mock<any, any>;
    onLoadFile: import("vitest/dist").Mock<any, any>;
    save: import("vitest/dist").Mock<any, any>;
    abstract getViewData(): string;
    abstract setViewData(data: string, clear: boolean): void;
    abstract clear(): void;
}
