import type { FileManager as IFileManager, App } from 'obsidian';
/**
 * Complete mock of the FileManager
 * @public
 */
export declare class FileManager implements IFileManager {
    app: App;
    private vault;
    private fileTree;
    constructor(app: App);
    createNewMarkdownFile: import("vitest/dist").Mock<any, any>;
    /**
     * @public
     */
    getNewFileParent: import("vitest/dist").Mock<any, any>;
    /**
     * @public
     */
    renameFile: import("vitest/dist").Mock<any, any>;
    /**
     * @public
     */
    generateMarkdownLink: import("vitest/dist").Mock<any, any>;
    /**
     * @public
     */
    processFrontMatter: import("vitest/dist").Mock<any, any>;
    /**
     * @public
     */
    getAvailablePathForAttachment: import("vitest/dist").Mock<any, any>;
    trashFile: import("vitest/dist").Mock<any, any>;
    private createFolder;
    private getOrCreateParentFolder;
    private getRelativePath;
    save: import("vitest/dist").Mock<any, any>;
    deleteFile: import("vitest/dist").Mock<any, any>;
    getAbstractFileByPath: import("vitest/dist").Mock<any, any>;
    copy: import("vitest/dist").Mock<any, any>;
    move: import("vitest/dist").Mock<any, any>;
    getAvailablePath: import("vitest/dist").Mock<any, any>;
    getFileExtension: import("vitest/dist").Mock<any, any>;
    getBaseName: import("vitest/dist").Mock<any, any>;
    getDisplayPath: import("vitest/dist").Mock<any, any>;
    getUniqueFileName: import("vitest/dist").Mock<any, any>;
}
