import type { DataAdapter } from 'obsidian';
import { MockDataAdapter } from './data-adapter';
/**
 * Implementation of the vault adapter for mobile devices.
 * @public
 */
export declare class MockCapacitorAdapter extends MockDataAdapter implements DataAdapter {
    /**
     * @public
     */
    getName(): string;
    /**
     * @public
     */
    getFullPath(normalizedPath: string): string;
}
