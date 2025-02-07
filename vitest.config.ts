import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/__mocks__/setup.ts'],
        mockReset: true,
    },
    resolve: {
        alias: [{
            find: 'obsidian',
            replacement: resolve(__dirname, 'src/__mocks__/obsidian.ts')
        }]
    }
}); 