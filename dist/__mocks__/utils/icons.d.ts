export declare const iconStore: Map<string, string>;
/**
 * Add an icon to the library.
 * @param iconId - the icon identifier
 * @param svgContent - the SVG content of the icon
 */
export declare const addIcon: import("vitest/dist").Mock<[iconId: string, svgContent: string], void>;
/**
 * Get an icon from the library.
 * @param iconId - the icon identifier
 * @returns the SVG content of the icon or null if not found
 */
export declare const getIcon: import("vitest/dist").Mock<[iconId: string], string | null>;
/**
 * Check if an icon exists in the library.
 * @param iconId - the icon identifier
 * @returns true if the icon exists, false otherwise
 */
export declare const hasIcon: import("vitest/dist").Mock<[iconId: string], boolean>;
/**
 * Remove an icon from the library.
 * Useful for tests.
 * @param iconId - the icon identifier
 */
export declare const removeIcon: import("vitest/dist").Mock<[iconId: string], void>;
/**
 * Clear the icon library.
 * Useful for resetting state between tests.
 */
export declare const clearIcons: import("vitest/dist").Mock<[], void>;
