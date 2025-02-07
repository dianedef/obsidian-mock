import { vi } from 'vitest';
export const normalizePath = vi.fn((path) => {
    // Remplace les backslashes par des forward slashes
    path = path.replace(/\\/g, '/');
    // Supprime les slashes multiples consécutifs
    path = path.replace(/\/+/g, '/');
    // Supprime les points uniques (./foo -> foo)
    path = path.replace(/\/\.\//g, '/');
    // Supprime les slashes au début et à la fin
    path = path.replace(/^\/+|\/+$/g, '');
    // Gère les chemins relatifs (../foo)
    const parts = path.split('/');
    const normalized = [];
    for (const part of parts) {
        if (part === '..') {
            normalized.pop();
        }
        else if (part !== '.' && part !== '') {
            normalized.push(part);
        }
    }
    return normalized.join('/');
});
