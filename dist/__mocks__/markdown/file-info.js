export class MarkdownFileInfo {
    constructor(app, file = null, editor) {
        this.app = app;
        this._file = file;
        this.editor = editor;
        this.hoverPopover = null;
    }
    get file() {
        return this._file;
    }
    clear() {
        this._file = null;
        this.editor = undefined;
        this.hoverPopover = null;
    }
    getSelection() {
        return this.editor?.getSelection() || '';
    }
}
