import { vi } from 'vitest';
import type { CloseableComponent as ICloseableComponent } from 'obsidian';

export class CloseableComponent implements ICloseableComponent {
    close = vi.fn();
} 