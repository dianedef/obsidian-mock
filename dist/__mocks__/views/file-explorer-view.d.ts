import type { WorkspaceLeaf } from 'obsidian';
import obsidian from '../setup';
export declare class FileExplorerView extends obsidian.ItemView {
    private files;
    private selectedFile;
    constructor(leaf: WorkspaceLeaf);
    getViewType(): string;
    getDisplayText(): string;
    addFile: import("vitest/dist").Mock<any, any>;
    removeFile: import("vitest/dist").Mock<any, any>;
    selectFile: import("vitest/dist").Mock<any, any>;
    getSelectedFile: import("vitest/dist").Mock<any, any>;
    getAllFiles: import("vitest/dist").Mock<any, any>;
    revealFile: import("vitest/dist").Mock<any, any>;
    private refresh;
    handleDrop: import("vitest/dist").Mock<any, any>;
    search: import("vitest/dist").Mock<any, any>;
}
