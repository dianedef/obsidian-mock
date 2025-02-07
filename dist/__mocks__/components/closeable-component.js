import { vi } from 'vitest';
export class MockCloseableComponent {
    constructor() {
        this.close = vi.fn();
    }
}
