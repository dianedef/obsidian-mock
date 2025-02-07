import { Plugin, TFile, Vault } from 'obsidian';
export declare const createMockVault: () => Vault;
export declare const createMockPlugin: (vault: Vault) => Plugin;
export declare const createMockFile: (path: string, mtime: number) => TFile;
