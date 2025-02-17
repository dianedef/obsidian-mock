import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Commands } from '../../__mocks__/core/commands';
import type { Command, Hotkey } from 'obsidian';

describe('Commands', () => {
    let commands: Commands;

    // Créer un mock explicite de commande valide
    const createMockCommand = (id: string, name: string = 'Test Command'): Command => ({
        id,
        name,
        callback: vi.fn()
    });

    beforeEach(() => {
        commands = new Commands();
        vi.clearAllMocks();
    });

    describe('Basic Command Management', () => {
        it('should add and find command', () => {
            const command = createMockCommand('test-command');
            commands.addCommand(command);
            const found = commands.findCommand('test-command');
            expect(found).toBeDefined();
            expect(found?.id).toBe('test-command');
        });

        it('should remove command', () => {
            const command = createMockCommand('test-command');
            commands.addCommand(command);
            commands.removeCommand('test-command');
            expect(commands.findCommand('test-command')).toBeNull();
        });

        it('should list all commands', () => {
            const command1 = createMockCommand('command1', 'Command 1');
            const command2 = createMockCommand('command2', 'Command 2');

            commands.addCommand(command1);
            commands.addCommand(command2);

            const list = commands.listCommands();
            expect(list).toHaveLength(2);
            expect(list.map((c: Command) => c.id)).toContain('command1');
            expect(list.map((c: Command) => c.id)).toContain('command2');
        });

        it('should not allow duplicate command ids', () => {
            const command1 = createMockCommand('test-command');
            const command2 = createMockCommand('test-command');

            commands.addCommand(command1);
            expect(() => commands.addCommand(command2))
                .toThrow('Command with id test-command already exists');
        });
    });

    describe('Hotkeys Support', () => {
        it('should register command with hotkeys', () => {
            const hotkeys: Hotkey[] = [
                { modifiers: ['Mod', 'Shift'], key: 'P' }
            ];

            const command: Command = {
                ...createMockCommand('test-command'),
                hotkeys
            };

            commands.addCommand(command);
            const registeredHotkeys = commands.getHotkeys('test-command');
            expect(registeredHotkeys).toEqual(hotkeys);
        });

        it('should remove hotkeys when removing command', () => {
            const command: Command = {
                ...createMockCommand('test-command'),
                hotkeys: [{ modifiers: ['Mod'], key: 'P' }]
            };

            commands.addCommand(command);
            commands.removeCommand('test-command');
            expect(commands.getHotkeys('test-command')).toBeUndefined();
        });

        it('should validate hotkey format', () => {
            const command: Command = {
                ...createMockCommand('test-command'),
                hotkeys: [{ modifiers: ['Mod'] }] as any // Hotkey sans 'key'
            };

            expect(() => commands.addCommand(command))
                .toThrow('Hotkey must have a key');
        });

        it('should validate hotkeys is an array', () => {
            const command: Command = {
                ...createMockCommand('test-command'),
                hotkeys: {} as any // Hotkeys non-array
            };

            expect(() => commands.addCommand(command))
                .toThrow('Command hotkeys must be an array');
        });
    });

    describe('Error Handling', () => {
        it('should throw error when command is null', () => {
            expect(() => commands.addCommand(null as unknown as Command))
                .toThrow('Command cannot be null or undefined');
        });

        it('should throw error when command is undefined', () => {
            expect(() => commands.addCommand(undefined as unknown as Command))
                .toThrow('Command cannot be null or undefined');
        });

        it('should throw error when adding command without id', () => {
            const invalidCommand = {
                name: 'Invalid Command',
                callback: vi.fn()
            };

            expect(() => commands.addCommand(invalidCommand as unknown as Command))
                .toThrow('Command must have an id');
        });

        it('should throw error when adding command without name', () => {
            const invalidCommand = {
                id: 'test-command',
                callback: vi.fn()
            };

            expect(() => commands.addCommand(invalidCommand as unknown as Command))
                .toThrow('Command must have a name');
        });

        it('should handle and propagate callback errors', async () => {
            const error = new Error('Test error');
            const command = createMockCommand('test-command');
            command.callback = vi.fn().mockRejectedValue(error);

            commands.addCommand(command);
            await expect(commands.executeCommand('test-command')).rejects.toThrow('Test error');
        });

        it('should wrap callback with error handling', async () => {
            const consoleSpy = vi.spyOn(console, 'error');
            const error = new Error('Test error');
            const command = createMockCommand('test-command');
            command.callback = vi.fn().mockRejectedValue(error);

            commands.addCommand(command);
            await expect(commands.executeCommand('test-command')).rejects.toThrow();
            expect(consoleSpy).toHaveBeenCalledWith(
                'Error executing command test-command:',
                error
            );
        });

        it('should handle non-existent command execution', async () => {
            const result = await commands.executeCommand('non-existent');
            expect(result).toBe(false);
        });

        it('should handle command without callback', async () => {
            const command: Command = {
                id: 'test-command',
                name: 'Test Command'
            };

            commands.addCommand(command);
            const result = await commands.executeCommand('test-command');
            expect(result).toBe(false);
        });

        it('should handle null command id in operations', () => {
            expect(() => commands.removeCommand(null as unknown as string))
                .toThrow('Command id cannot be null or empty');
            
            expect(() => commands.executeCommand(null as unknown as string))
                .rejects.toThrow('Command id cannot be null or empty');
            
            expect(commands.findCommand(null as unknown as string))
                .toBeNull();
            
            expect(commands.getHotkeys(null as unknown as string))
                .toBeUndefined();
        });

        it('should handle empty command id in operations', () => {
            expect(() => commands.removeCommand(''))
                .toThrow('Command id cannot be null or empty');
            
            expect(() => commands.executeCommand(''))
                .rejects.toThrow('Command id cannot be null or empty');
            
            expect(commands.findCommand(''))
                .toBeNull();
            
            expect(commands.getHotkeys(''))
                .toBeUndefined();
        });
    });

    describe('Command Search', () => {
        beforeEach(() => {
            const mockCommands: Command[] = [
                createMockCommand('test-1', 'Test One'),
                createMockCommand('test-2', 'Test Two'),
                createMockCommand('other', 'Other Command')
            ];
            mockCommands.forEach(cmd => commands.addCommand(cmd));
        });

        it('should find command by id', () => {
            const result = commands.findCommand('test-1');
            expect(result).toBeDefined();
            expect(result?.id).toBe('test-1');
        });

        it('should return null for non-existent command', () => {
            const result = commands.findCommand('NonExistent');
            expect(result).toBeNull();
        });
    });
}); 