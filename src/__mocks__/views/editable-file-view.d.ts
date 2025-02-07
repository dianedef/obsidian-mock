import { vi } from 'vitest';
import type { TFile } from 'obsidian';
import { FileView } from './file-view';

export abstract class EditableFileView extends FileView {
    abstract save(clear?: boolean): Promise<void>;
    abstract getViewData(): string;
    abstract setViewData(data: string, clear: boolean): void;
    abstract clear(): void;
} 