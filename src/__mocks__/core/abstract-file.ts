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
        this.path = typeof path === 'string' ? path : String(path);
        const normalizedPath = this.path.replace(/\\/g, '/');
        this.name = normalizedPath.split('/').pop() || '';
        this.parent = parent;
    }
} 