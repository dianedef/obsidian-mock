import { TFile, TFolder } from 'obsidian';
export declare class FileManager {
    processFrontMatter(_content: string): {
        [key: string]: any;
    };
    save(_file: TFile, _content: string): Promise<void>;
    createNewMarkdownFile(_folder: TFolder, _filename: string, _content: string): Promise<void>;
    generateMarkdownLink(_file: TFile, _sourcePath: string, _subpath?: string, _alias?: string): string;
    getNewFileParent(): Promise<TFolder>;
    renameFile(_file: TFile, _newPath: string): Promise<void>;
    getAvailablePathForAttachment(_filename: string, _file: TFile): Promise<string>;
    trashFile(_file: TFile): Promise<void>;
}
