import { vi } from 'vitest';
import type { DataAdapter as IDataAdapter } from 'obsidian';
import { DataAdapter } from './data-adapter';


/**
 * Implementation of the vault adapter for mobile devices.
 * @public
 */
export class CapacitorAdapter extends DataAdapter implements IDataAdapter {
    /**
     * @public

     */
    getName(): string {
        return 'mock-capacitor-adapter';
    }

    /**
     * @public
     */
    getFullPath(normalizedPath: string): string {
        return `/mock-device/${normalizedPath}`;
    }
} 