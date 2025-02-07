import type { Vault } from 'obsidian';
import type { TFolder } from './folder';
/**
 * Cette classe peut être soit un `TFile` soit un `TFolder`.
 * @public
 */
export declare abstract class TAbstractFile {
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
    constructor(vault: Vault, path: string, parent?: TFolder | null);
}
