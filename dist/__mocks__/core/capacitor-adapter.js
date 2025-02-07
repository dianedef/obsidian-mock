import { MockDataAdapter } from './data-adapter';
/**
 * Implementation of the vault adapter for mobile devices.
 * @public
 */
export class MockCapacitorAdapter extends MockDataAdapter {
    /**
     * @public
     */
    getName() {
        return 'mock-capacitor-adapter';
    }
    /**
     * @public
     */
    getFullPath(normalizedPath) {
        return `/mock-device/${normalizedPath}`;
    }
}
