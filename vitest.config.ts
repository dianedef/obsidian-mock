import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/__mocks__/utils/dom.ts'],
        include: ['src/**/*.test.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/**/*.ts'],
            exclude: ['src/**/*.test.ts', 'src/**/*.d.ts']
        }
    },
    resolve: {
        alias: [
            {
                find: 'obsidian',
                replacement: resolve(__dirname, 'src/__mocks__/obsidian.ts')
            },
            {
                find: /^\.\.\/\.\.\/core\/(.*)$/,
                replacement: resolve(__dirname, 'src/__mocks__/core/$1')
            },
            {
                find: /^\.\.\/\.\.\/components\/(.*)$/,
                replacement: resolve(__dirname, 'src/__mocks__/components/$1')
            },
            {
                find: /^\.\.\/\.\.\/ui\/(.*)$/,
                replacement: resolve(__dirname, 'src/__mocks__/ui/$1')
            },
            {
                find: /^\.\.\/\.\.\/views\/(.*)$/,
                replacement: resolve(__dirname, 'src/__mocks__/views/$1')
            }
        ]
    }
}); 