import { vi } from 'vitest';
import type { Debouncer } from 'obsidian';

/**
 * Mock version of the standard debounce function
 * @public
 */
export function debounce<T extends unknown[], V>(
    cb: (...args: [...T]) => V,
    timeout: number = 0,
    resetTimer: boolean = false
): Debouncer<T, V> {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: T | null = null;

    const debounced = (...args: [...T]): Debouncer<T, V> => {
        lastArgs = args;
        
        if (timer && resetTimer) {
            clearTimeout(timer);
            timer = null;
        }

        if (!timer) {
            timer = setTimeout(() => {
                if (lastArgs) {
                    cb(...lastArgs);
                }
                timer = null;
                lastArgs = null;
            }, timeout);
        }

        return debounced;
    };

    debounced.cancel = (): Debouncer<T, V> => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        lastArgs = null;
        return debounced;
    };

    debounced.run = (): V | void => {
        if (lastArgs) {
            const result = cb(...lastArgs);
            lastArgs = null;
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            return result;
        }
    };

    // For tests, expose these mocked functions
    vi.spyOn(debounced, 'cancel');
    vi.spyOn(debounced, 'run');

    return debounced;
} 