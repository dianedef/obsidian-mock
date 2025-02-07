import { vi } from 'vitest';
import type { TFile, ViewStateResult, WorkspaceLeaf, Events, App } from 'obsidian';
import { ItemView } from './item-view';

/**
 * File view mock
 * @public
 */
export abstract class FileView extends ItemView {
    allowNoFile: boolean = false;
    file: TFile | null = null;
    navigation: boolean = true;
    app: App;

    registerEvent = vi.fn();
    on = vi.fn();
    off = vi.fn();
    offref = vi.fn();
    trigger = vi.fn();
    tryTrigger = vi.fn();
    getDisplayText = vi.fn().mockImplementation((): string => this.file?.basename || 'Untitled');
    onload = vi.fn();
    getState = vi.fn().mockImplementation((): Record<string, unknown> => {
        const baseState = ItemView.prototype.getState.call(this);
        return {
            ...baseState,
            file: this.file ? this.file.path : null
        };
    });

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        this.app = (leaf as any).app;
        this.navigation = true;
        this.registerEvent(
            (this.app.workspace as unknown as Events).on('file-open', ((file: TFile) => {
                if (this.file && this.file !== file) {
                    this.onUnloadFile(this.file);
                }
                this.file = file;
                if (file) {
                    this.onLoadFile(file);
                }
            }) as (...data: unknown[]) => unknown)
        );
        this.registerEvent(
            (this.app.vault as unknown as Events).on('rename', ((file: TFile, _oldPath: string) => {
                if (this.file === file) {
                    this.onRename(file);
                }
            }) as (...data: unknown[]) => unknown)
        );
    }

    setState = vi.fn().mockImplementation(async (state: any, result: ViewStateResult): Promise<void> => {
        await ItemView.prototype.setState.call(this, state, result);
        if (state.file) {
            const file = this.app.vault.getAbstractFileByPath(state.file);
            if (file && 'basename' in file) {
                this.file = file as TFile;
                await this.onLoadFile(this.file);
            }
        }
    });

    onLoadFile = vi.fn().mockImplementation(async (_file: TFile): Promise<void> => {});
    onUnloadFile = vi.fn().mockImplementation(async (_file: TFile): Promise<void> => {});
    onRename = vi.fn().mockImplementation(async (_file: TFile): Promise<void> => {});
    canAcceptExtension = vi.fn().mockImplementation((_extension: string): boolean => true);
} 