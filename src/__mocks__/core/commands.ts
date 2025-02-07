import { Command } from 'obsidian';
import { vi } from 'vitest';

export class Commands {
    commands: Record<string, Command> = {};

    executeCommand(id: string): boolean {
        return true;
    }

    findCommand(id: string): Command | null {
        return null;
    }

    listCommands(): Command[] {
        return [];
    }

    removeCommand(id: string): void {
        // Implementation
    }

    addCommand(command: Command): void {
        // Implementation
    }
} 