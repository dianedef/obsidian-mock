import type { FileStats } from './file-system-adapter';
import { TAbstractFile } from './abstract-file';
import type { Vault } from 'obsidian';
import type { TFolder } from './folder';
/**
 * @public
 */
export declare class TFile extends TAbstractFile {
    /**
     * @public
     */
    stat: FileStats;
    /**
     * @public
     */
    basename: string;
    /**
     * @public
     */
    extension: string;
    constructor(vault: Vault, path: string, parent?: TFolder | null);
}
