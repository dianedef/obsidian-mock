import { TAbstractFile } from './abstract-file';
/**
 * @public
 */
export declare class TFolder extends TAbstractFile {
    /**
     * @public
     */
    children: TAbstractFile[];
    /**
     * @public
     */
    isRoot(): boolean;
}
