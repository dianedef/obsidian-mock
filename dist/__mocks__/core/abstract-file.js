/**
 * Cette classe peut être soit un `TFile` soit un `TFolder`.
 * @public
 */
export class TAbstractFile {
    constructor(vault, path, parent = null) {
        this.vault = vault;
        this.path = path;
        this.name = path.split('/').pop() || '';
        this.parent = parent;
    }
}
