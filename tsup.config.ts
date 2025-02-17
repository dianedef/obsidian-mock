import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    treeshake: true,
    external: ['obsidian'],
    platform: 'node',
    esbuildOptions(options) {
        options.platform = 'node';
        options.footer = {
            // Préserve la compatibilité CommonJS
            js: 'if (module.exports.default) module.exports = module.exports.default;'
        };
    }
}); 