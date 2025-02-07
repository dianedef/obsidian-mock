import { vi } from 'vitest';
import type { 
    Editor as IEditor,
    MarkdownView,
    EditorPosition,
    EditorScrollInfo,
    EditorRange,
    EditorSelectionOrCaret,
    EditorTransaction,
    EditorCommandName,
    EditorChange,
    EditorSelection
} from 'obsidian';

export class EditorImpl implements IEditor {
    private content: string = '';
    private view: MarkdownView;

    constructor(view: MarkdownView) {
        this.view = view;
        this.content = '';
    }

    getValue = vi.fn().mockReturnValue('');
    setValue = vi.fn();
    getLine = vi.fn().mockReturnValue('');
    setLine = vi.fn();
    lineCount = vi.fn().mockReturnValue(0);
    lastLine = vi.fn().mockReturnValue(-1);
    getSelection = vi.fn().mockReturnValue('');
    getRange = vi.fn().mockReturnValue('');
    replaceRange = vi.fn();
    replaceSelection = vi.fn();
    getCursor = vi.fn().mockReturnValue({ line: 0, ch: 0 });
    setCursor = vi.fn();
    setSelection = vi.fn();
    setSelections = vi.fn();
    focus = vi.fn();
    blur = vi.fn();
    hasFocus = vi.fn().mockReturnValue(false);
    getScrollInfo = vi.fn().mockReturnValue({ top: 0, left: 0 });
    scrollTo = vi.fn();
    scrollIntoView = vi.fn();
    undo = vi.fn();
    redo = vi.fn();
    exec = vi.fn();
    transaction = vi.fn();
    wordAt = vi.fn().mockReturnValue({ from: { line: 0, ch: 0 }, to: { line: 0, ch: 0 } });
    posToOffset = vi.fn().mockReturnValue(0);
    offsetToPos = vi.fn().mockReturnValue({ line: 0, ch: 0 });
    processLines = vi.fn();
    getDoc = vi.fn().mockReturnValue(this);
    somethingSelected = vi.fn().mockReturnValue(false);
    refresh = vi.fn();
    clearHistory = vi.fn();
    listSelections = vi.fn().mockReturnValue([]);
}
