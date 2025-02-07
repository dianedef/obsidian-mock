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
    esbuildOptions(options) {
        options.footer = {
            // Préserve la compatibilité CommonJS
            js: 'if (module.exports.default) module.exports = module.exports.default;'
        };
    }
}); 