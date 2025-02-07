import { vi } from 'vitest';
import { ItemView } from './item-view';
/**
 * File view mock
 * @public
 */
export class FileView extends ItemView {
    constructor(leaf) {
        super(leaf);
        this.allowNoFile = false;
        this.file = null;
        this.navigation = true;
        this.registerEvent = vi.fn();
        this.on = vi.fn();
        this.off = vi.fn();
        this.offref = vi.fn();
        this.trigger = vi.fn();
        this.tryTrigger = vi.fn();
        this.getDisplayText = vi.fn().mockImplementation(() => this.file?.basename || 'Untitled');
        this.onload = vi.fn();
        this.getState = vi.fn().mockImplementation(() => {
            const baseState = ItemView.prototype.getState.call(this);
            return {
                ...baseState,
                file: this.file ? this.file.path : null
            };
        });
        this.setState = vi.fn().mockImplementation(async (state, result) => {
            await ItemView.prototype.setState.call(this, state, result);
            if (state.file) {
                const file = this.app.vault.getAbstractFileByPath(state.file);
                if (file && 'basename' in file) {
                    this.file = file;
                    await this.onLoadFile(this.file);
                }
            }
        });
        this.onLoadFile = vi.fn().mockImplementation(async (_file) => { });
        this.onUnloadFile = vi.fn().mockImplementation(async (_file) => { });
        this.onRename = vi.fn().mockImplementation(async (_file) => { });
        this.canAcceptExtension = vi.fn().mockImplementation((_extension) => true);
        this.app = leaf.app;
        this.navigation = true;
        this.registerEvent(this.app.workspace.on('file-open', ((file) => {
            if (this.file && this.file !== file) {
                this.onUnloadFile(this.file);
            }
            this.file = file;
            if (file) {
                this.onLoadFile(file);
            }
        })));
        this.registerEvent(this.app.vault.on('rename', ((file, _oldPath) => {
            if (this.file === file) {
                this.onRename(file);
            }
        })));
    }
}
