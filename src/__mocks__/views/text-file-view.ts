import { vi } from 'vitest';
import type { TFile, WorkspaceLeaf, App } from 'obsidian';
import { EditableFileView } from './editable-file-view.d';

/**
 * This class implements an editable text file view that can be loaded and saved with an editor.
 * @public
 */
export abstract class TextFileView extends EditableFileView {
    data: string = '';
    file: TFile | null = null;
    app: App;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        this.app = (leaf as any).app;
    }

    requestSave = vi.fn().mockImplementation((): void => {
        setTimeout(() => this.save(), 2000);
    });

    onUnloadFile = vi.fn().mockImplementation(async (file: TFile): Promise<void> => {
        await this.save();
        this.data = '';
    });

    onLoadFile = vi.fn().mockImplementation(async (file: TFile): Promise<void> => {
        const data = await this.app.vault.read(file);
        this.data = data;
        this.setViewData(data, true);
    });

    save = vi.fn().mockImplementation(async (clear: boolean = false): Promise<void> => {
        const data = this.getViewData();
        if (this.file && data !== null && data !== undefined) {
            await this.app.vault.modify(this.file, data);
            if (clear) {
                this.clear();
            }
        }
    });

    abstract getViewData(): string;
    abstract setViewData(data: string, clear: boolean): void;
    abstract clear(): void;
} 