import { TAbstractFile } from './abstract-file';
/**
 * @public
 */
export class TFile extends TAbstractFile {
    constructor(vault, path, parent = null) {
        super(vault, path, parent);
        // Initialise les propriétés spécifiques aux fichiers
        const pathParts = path.split('.');
        this.extension = pathParts.length > 1 ? pathParts.pop() : '';
        this.basename = pathParts.join('.');
        // Initialise les stats par défaut
        this.stat = {
            ctime: Date.now(),
            mtime: Date.now(),
            size: 0
        };
    }
}
