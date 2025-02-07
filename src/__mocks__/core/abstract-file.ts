import type { Vault } from 'obsidian';
import type { TFolder } from './folder';

/**
 * Cette classe peut être soit un `TFile` soit un `TFolder`.
 * @public
 */
export abstract class TAbstractFile {
    /**
     * @public
     */
    vault: Vault;

    /**
     * @public
     */
    path: string;

    /**
     * @public
     */
    name: string;

    /**
     * @public
     */
    parent: TFolder | null;

    constructor(vault: Vault, path: string, parent: TFolder | null = null) {
        this.vault = vault;
        this.path = path;
        this.name = path.split('/').pop() || '';
        this.parent = parent;
    }
} 