import { vi } from 'vitest';
import type { Command, App, Hotkey } from 'obsidian';

export class Commands {
    private commands: Map<string, Command> = new Map();
    private hotkeyMap: Map<string, Hotkey[]> = new Map();

    addCommand = vi.fn<[Command], void>().mockImplementation((command: Command): void => {
        try {
            // Validation complète de la commande
            if (!command) {
                throw new Error('Command cannot be null or undefined');
            }
            if (!command.id) {
                throw new Error('Command must have an id');
            }
            if (!command.name) {
                throw new Error('Command must have a name');
            }

            // Vérifier si la commande existe déjà
            if (this.commands.has(command.id)) {
                throw new Error(`Command with id ${command.id} already exists`);
            }

            // Valider et enregistrer les hotkeys si présentes
            if (command.hotkeys !== undefined) {
                if (!Array.isArray(command.hotkeys)) {
                    throw new Error('Command hotkeys must be an array');
                }
                command.hotkeys.forEach(hotkey => {
                    if (!hotkey.key) {
                        throw new Error('Hotkey must have a key');
                    }
                });
                this.hotkeyMap.set(command.id, command.hotkeys);
            }

            // Créer un wrapper pour le callback qui gère les erreurs
            if (command.callback) {
                const originalCallback = command.callback;
                command.callback = async function(this: any) {
                    try {
                        return await originalCallback.call(this);
                    } catch (error) {
                        console.error(`Error executing command ${command.id}:`, error);
                        throw error;
                    }
                };
            }

            // Enregistrer la commande
            this.commands.set(command.id, command);
        } catch (error) {
            console.error('Error adding command:', error);
            throw error;
        }
    });

    removeCommand = vi.fn<[string], void>().mockImplementation((id: string): void => {
        if (!id) {
            throw new Error('Command id cannot be null or empty');
        }
        this.commands.delete(id);
        this.hotkeyMap.delete(id);
    });

    executeCommand = vi.fn<[string], Promise<boolean>>().mockImplementation(async (id: string): Promise<boolean> => {
        if (!id) {
            throw new Error('Command id cannot be null or empty');
        }

        const command = this.commands.get(id);
        if (!command) {
            console.warn(`Command not found: ${id}`);
            return false;
        }

        if (!command.callback) {
            console.warn(`Command ${id} has no callback`);
            return false;
        }

        try {
            await command.callback();
            return true;
        } catch (error) {
            console.error(`Error executing command ${id}:`, error);
            throw error;
        }
    });

    executeCommandById = vi.fn<[string], Promise<boolean>>().mockImplementation(async (id: string): Promise<boolean> => {
        return this.executeCommand(id);
    });

    listCommands = vi.fn<[], Command[]>().mockImplementation((): Command[] => {
        return Array.from(this.commands.values());
    });

    findCommand = vi.fn<[string], Command | null>().mockImplementation((id: string): Command | null => {
        if (!id) {
            return null;
        }
        return this.commands.get(id) || null;
    });

    getHotkeys(commandId: string): Hotkey[] | undefined {
        if (!commandId) {
            return undefined;
        }
        return this.hotkeyMap.get(commandId);
    }
} 