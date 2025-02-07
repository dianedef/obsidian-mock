import { vi } from 'vitest';
export class EditorImpl {
    constructor(view) {
        this.content = '';
        this.getValue = vi.fn().mockReturnValue('');
        this.setValue = vi.fn();
        this.getLine = vi.fn().mockReturnValue('');
        this.setLine = vi.fn();
        this.lineCount = vi.fn().mockReturnValue(0);
        this.lastLine = vi.fn().mockReturnValue(-1);
        this.getSelection = vi.fn().mockReturnValue('');
        this.getRange = vi.fn().mockReturnValue('');
        this.replaceRange = vi.fn();
        this.replaceSelection = vi.fn();
        this.getCursor = vi.fn().mockReturnValue({ line: 0, ch: 0 });
        this.setCursor = vi.fn();
        this.setSelection = vi.fn();
        this.setSelections = vi.fn();
        this.focus = vi.fn();
        this.blur = vi.fn();
        this.hasFocus = vi.fn().mockReturnValue(false);
        this.getScrollInfo = vi.fn().mockReturnValue({ top: 0, left: 0 });
        this.scrollTo = vi.fn();
        this.scrollIntoView = vi.fn();
        this.undo = vi.fn();
        this.redo = vi.fn();
        this.exec = vi.fn();
        this.transaction = vi.fn();
        this.wordAt = vi.fn().mockReturnValue({ from: { line: 0, ch: 0 }, to: { line: 0, ch: 0 } });
        this.posToOffset = vi.fn().mockReturnValue(0);
        this.offsetToPos = vi.fn().mockReturnValue({ line: 0, ch: 0 });
        this.processLines = vi.fn();
        this.getDoc = vi.fn().mockReturnValue(this);
        this.somethingSelected = vi.fn().mockReturnValue(false);
        this.refresh = vi.fn();
        this.clearHistory = vi.fn();
        this.listSelections = vi.fn().mockReturnValue([]);
        this.view = view;
        this.content = '';
    }
}
