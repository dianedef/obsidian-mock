import { TAbstractFile } from './abstract-file';
import type { Vault } from 'obsidian';

/**
 * @public
 */
export class TFolder extends TAbstractFile {
    /**
     * @public
     */
    children: TAbstractFile[] = [];

    /**
     * @public
     */
    isRoot(): boolean {
        return this.path === '/' || this.path === '';
    }
} 