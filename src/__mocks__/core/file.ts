import type { FileStats } from './file-system-adapter';
import { TAbstractFile } from './abstract-file';
import type { Vault } from 'obsidian';
import type { TFolder } from './folder';

/**
 * @public
 */
export class TFile extends TAbstractFile {
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

    constructor(vault: Vault, path: string, parent: TFolder | null = null) {
        super(vault, path, parent);
        
        // Initialise les propriétés spécifiques aux fichiers
        const pathParts = path.split('.');
        this.extension = pathParts.length > 1 ? pathParts.pop()! : '';
        this.basename = pathParts.join('.');
        
        // Initialise les stats par défaut
        this.stat = {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 0
        };
    }
} 