import { Keymap as IKeymap } from 'obsidian';
export declare class Keymap implements IKeymap {
    pushScope(scope: string): void;
    popScope(scope: string): void;
    static isModifier(evt: MouseEvent | TouchEvent | KeyboardEvent, modifier: string): boolean;
    static isModEvent(evt: MouseEvent | TouchEvent | KeyboardEvent): boolean;
}
