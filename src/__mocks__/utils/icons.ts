import { vi } from 'vitest';

// Icon storage
export const iconStore: Map<string, string> = new Map();

/**
 * Add an icon to the library.
 * @param iconId - the icon identifier
 * @param svgContent - the SVG content of the icon
 */
export const addIcon = vi.fn((iconId: string, svgContent: string): void => {
    iconStore.set(iconId, svgContent);
});

/**
 * Get an icon from the library.
 * @param iconId - the icon identifier
 * @returns the SVG content of the icon or null if not found
 */
export const getIcon = vi.fn((iconId: string): string | null => {
    return iconStore.get(iconId) || null;
});

/**
 * Check if an icon exists in the library.
 * @param iconId - the icon identifier
 * @returns true if the icon exists, false otherwise
 */
export const hasIcon = vi.fn((iconId: string): boolean => {
    return iconStore.has(iconId);
});

/**
 * Remove an icon from the library.
 * Useful for tests.
 * @param iconId - the icon identifier
 */
export const removeIcon = vi.fn((iconId: string): void => {
    iconStore.delete(iconId);
});

/**
 * Clear the icon library.
 * Useful for resetting state between tests.
 */
export const clearIcons = vi.fn((): void => {
    iconStore.clear();
}); 