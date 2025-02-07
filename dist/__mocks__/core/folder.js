import { TAbstractFile } from './abstract-file';
/**
 * @public
 */
export class TFolder extends TAbstractFile {
    constructor() {
        super(...arguments);
        /**
         * @public
         */
        this.children = [];
    }
    /**
     * @public
     */
    isRoot() {
        return this.path === '/' || this.path === '';
    }
}
