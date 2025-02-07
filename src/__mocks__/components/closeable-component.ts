import { vi } from 'vitest';
import type { CloseableComponent } from 'obsidian';

export class MockCloseableComponent implements CloseableComponent {
    close = vi.fn();
} 