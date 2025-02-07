import { Scope as IScope } from 'obsidian';
export declare class Scope implements IScope {
    register(modifiers: string[], key: string | null, func: (evt: KeyboardEvent) => boolean): void;
    unregister(modifiers: string[], key: string | null): void;
}
