import { vi } from 'vitest';
import type { DataAdapter } from 'obsidian';
import { MockDataAdapter } from './data-adapter';

/**
 * Implementation of the vault adapter for mobile devices.
 * @public
 */
export class MockCapacitorAdapter extends MockDataAdapter implements DataAdapter {
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