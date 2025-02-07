import { vi } from 'vitest';
import { EditableFileView } from './editable-file-view.d';
/**
 * This class implements an editable text file view that can be loaded and saved with an editor.
 * @public
 */
export class TextFileView extends EditableFileView {
    constructor(leaf) {
        super(leaf);
        this.data = '';
        this.file = null;
        this.requestSave = vi.fn().mockImplementation(() => {
            setTimeout(() => this.save(), 2000);
        });
        this.onUnloadFile = vi.fn().mockImplementation(async (file) => {
            await this.save();
            this.data = '';
        });
        this.onLoadFile = vi.fn().mockImplementation(async (file) => {
            const data = await this.app.vault.read(file);
            this.data = data;
            this.setViewData(data, true);
        });
        this.save = vi.fn().mockImplementation(async (clear = false) => {
            const data = this.getViewData();
            if (this.file && data !== null && data !== undefined) {
                await this.app.vault.modify(this.file, data);
                if (clear) {
                    this.clear();
                }
            }
        });
        this.app = leaf.app;
    }
}
