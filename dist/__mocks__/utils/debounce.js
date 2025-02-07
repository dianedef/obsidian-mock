import { vi } from 'vitest';
/**
 * Mock version of the standard debounce function
 * @public
 */
export function debounce(cb, timeout = 0, resetTimer = false) {
    let timer = null;
    let lastArgs = null;
    const debounced = (...args) => {
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
    debounced.cancel = () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        lastArgs = null;
        return debounced;
    };
    debounced.run = () => {
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
