import { Command } from 'obsidian';
export declare class Commands {
    commands: Record<string, Command>;
    executeCommand(id: string): boolean;
    findCommand(id: string): Command | null;
    listCommands(): Command[];
    removeCommand(id: string): void;
    addCommand(command: Command): void;
}
