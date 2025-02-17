import type { Vault, Stat } from 'obsidian';
import { TAbstractFile } from './abstract-file';
import type { TFolder } from './folder';

/**
 * @public
 */
export class TFile extends TAbstractFile {
    /**
     * @public
     */
    stat: Stat;

    /**
     * @public
     */
    basename: string;

    /**
     * @public
     */
    extension: string;

    constructor(path: string, vault: Vault) {
        super(vault, path);
        
        // Assure que le chemin est une chaîne
        const pathStr = String(path);
        
        // Obtient le nom du fichier (dernier segment du chemin)
        const fileName = pathStr.split('/').pop() || pathStr;
        
        // Initialise les propriétés spécifiques aux fichiers
        const nameParts = fileName.split('.');
        this.extension = nameParts.length > 1 ? nameParts.pop()! : '';
        this.basename = nameParts.join('.');
        
        // Initialise les stats par défaut
        this.stat = {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 0,
            type: 'file'
        };
    }
} 