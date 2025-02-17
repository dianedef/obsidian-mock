import { vi } from 'vitest';
import { Events } from './events';
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

export class EditorImpl extends Events implements IEditor {
    private content: string = '';
    private view: MarkdownView;
    private selections: EditorSelection[] = [];
    private history: string[] = [];
    private historyIndex: number = -1;

    constructor(view: MarkdownView) {
        super();
        this.view = view;
        this.clearHistory();
    }

    getValue = vi.fn().mockImplementation(() => this.content);
    setValue = vi.fn().mockImplementation((value: string) => {
        const oldContent = this.content;
        this.content = value;
        
        // Si c'est la première modification ou si la valeur est différente
        if (this.history.length === 0 || value !== oldContent) {
            // Supprimer l'historique après l'index actuel
            if (this.historyIndex < this.history.length - 1) {
                this.history = this.history.slice(0, this.historyIndex + 1);
            }
            this.history.push(value);
            this.historyIndex = this.history.length - 1;
        }
        
        this.trigger('change', { from: null, to: null, text: [value] });
    });

    getLine = vi.fn().mockReturnValue('');
    setLine = vi.fn();
    lineCount = vi.fn().mockReturnValue(0);
    lastLine = vi.fn().mockReturnValue(-1);
    
    getSelection = vi.fn().mockReturnValue('');
    getRange = vi.fn().mockReturnValue('');
    replaceRange = vi.fn().mockImplementation((replacement: string, from: EditorPosition, to: EditorPosition) => {
        // Simuler le remplacement de texte
        const lines = this.content.split('\n');
        const beforeLines = lines.slice(0, from.line);
        const afterLines = lines.slice(to.line + 1);
        const currentLine = lines[from.line];
        const newLine = currentLine.substring(0, from.ch) + replacement + currentLine.substring(to.ch);
        lines[from.line] = newLine;
        this.content = [...beforeLines, newLine, ...afterLines].join('\n');
    });

    replaceSelection = vi.fn().mockImplementation((replacement: string) => {
        const selection = this.getSelection();
        if (selection) {
            this.content = this.content.replace(selection, replacement);
        }
    });

    getCursor = vi.fn().mockReturnValue({ line: 0, ch: 0 });
    setCursor = vi.fn().mockImplementation((pos: EditorPosition) => {
        this.selections = [{ anchor: pos, head: pos }];
    });

    setSelection = vi.fn().mockImplementation((anchor: EditorPosition, head: EditorPosition) => {
        this.selections = [{ anchor, head }];
    });

    setSelections = vi.fn().mockImplementation((selections: EditorSelection[]) => {
        this.selections = selections;
    });

    getSelections = vi.fn().mockImplementation(() => this.selections);

    focus = vi.fn();
    blur = vi.fn();
    hasFocus = vi.fn().mockReturnValue(false);
    
    getScrollInfo = vi.fn().mockReturnValue({ top: 0, left: 0 });
    scrollTo = vi.fn();
    scrollIntoView = vi.fn();
    
    undo = vi.fn().mockImplementation(() => {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.content = this.history[this.historyIndex];
            this.trigger('change', { from: null, to: null, text: [this.content] });
        }
    });

    redo = vi.fn().mockImplementation(() => {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.content = this.history[this.historyIndex];
            this.trigger('change', { from: null, to: null, text: [this.content] });
        }
    });

    exec = vi.fn();
    transaction = vi.fn().mockImplementation((tr: EditorTransaction) => {
        if (tr.changes) {
            const changes = tr.changes as any;
            const newContent = typeof changes === 'string' ? changes : 
                             Array.isArray(changes.text) ? changes.text.join('\n') : 
                             changes.text || '';
            this.content = newContent;
            this.history.push(newContent);
            this.historyIndex = this.history.length - 1;
            this.trigger('change', { from: changes.from, to: changes.to, text: [newContent] });
        }
        return true;
    });

    wordAt = vi.fn().mockReturnValue({ from: { line: 0, ch: 0 }, to: { line: 0, ch: 0 } });
    posToOffset = vi.fn().mockReturnValue(0);
    offsetToPos = vi.fn().mockReturnValue({ line: 0, ch: 0 });
    processLines = vi.fn();
    
    getDoc = vi.fn().mockReturnValue(this);
    somethingSelected = vi.fn().mockReturnValue(false);
    refresh = vi.fn();
    clearHistory = vi.fn().mockImplementation(() => {
        // Ne pas commencer avec une chaîne vide dans l'historique
        this.history = [];
        this.historyIndex = -1;
        if (this.content) {
            this.history.push(this.content);
            this.historyIndex = 0;
        }
    });
    
    listSelections = vi.fn().mockReturnValue([]);
}
