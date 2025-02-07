import { describe, it, expect, beforeEach } from 'vitest';
import { App } from '../../core/app';
describe('App', () => {
    let app;
    beforeEach(() => {
        app = new App();
    });
    describe('Workspace', () => {
        it('should have an initialized workspace with mocked methods', () => {
            expect(app.workspace).toBeDefined();
            expect(app.workspace.on).toBeDefined();
            expect(app.workspace.off).toBeDefined();
            expect(app.workspace.getLeaf).toBeDefined();
            expect(app.workspace.getActiveViewOfType).toBeDefined();
            expect(app.workspace.iterateLeaves).toBeDefined();
        });
        it('should have basic workspace properties', () => {
            expect(app.workspace.leftSplit).toBeDefined();
            expect(app.workspace.rightSplit).toBeDefined();
            expect(app.workspace.rootSplit).toBeDefined();
            expect(app.workspace.floatingSplit).toBeNull();
            expect(app.workspace.leftRibbon).toBeDefined();
            expect(app.workspace.rightRibbon).toBeDefined();
            expect(app.workspace.containerEl).toBeInstanceOf(HTMLElement);
            expect(app.workspace.activeLeaf).toBeNull();
        });
        it('should have leaf management methods', () => {
            expect(app.workspace.setActiveLeaf).toBeDefined();
            expect(app.workspace.getActiveFile).toBeDefined();
            expect(app.workspace.getLastActiveLeaf).toBeDefined();
            expect(app.workspace.getGroupLeaves).toBeDefined();
            expect(app.workspace.getLeavesOfType).toBeDefined();
            expect(app.workspace.getUnpinnedLeaf).toBeDefined();
        });
        it('should handle leaf creation and activation', () => {
            const leaf = app.workspace.getLeaf();
            expect(leaf).toBeDefined();
            app.workspace.setActiveLeaf(leaf);
            expect(app.workspace.activeLeaf).toBe(leaf);
        });
    });
    describe('Vault', () => {
        it('should have an initialized vault with mocked methods', () => {
            expect(app.vault).toBeDefined();
            expect(app.vault.on).toBeDefined();
            expect(app.vault.off).toBeDefined();
            expect(app.vault.read).toBeDefined();
            expect(app.vault.create).toBeDefined();
            expect(app.vault.createBinary).toBeDefined();
            expect(app.vault.modify).toBeDefined();
            expect(app.vault.delete).toBeDefined();
            expect(app.vault.trash).toBeDefined();
            expect(app.vault.rename).toBeDefined();
            expect(app.vault.copy).toBeDefined();
        });
        it('should have an adapter with basic methods', () => {
            expect(app.vault.adapter).toBeDefined();
            expect(app.vault.adapter.getName).toBeDefined();
            expect(app.vault.adapter.read).toBeDefined();
            expect(app.vault.adapter.write).toBeDefined();
            expect(app.vault.adapter.mkdir).toBeDefined();
            expect(app.vault.adapter.exists).toBeDefined();
            expect(app.vault.adapter.stat).toBeDefined();
            expect(app.vault.adapter.remove).toBeDefined();
            expect(app.vault.adapter.rename).toBeDefined();
            expect(app.vault.adapter.copy).toBeDefined();
        });
    });
    describe('MetadataCache', () => {
        it('should have an initialized metadataCache with mocked methods', () => {
            expect(app.metadataCache).toBeDefined();
            expect(app.metadataCache.on).toBeDefined();
            expect(app.metadataCache.off).toBeDefined();
            expect(app.metadataCache.getFileCache).toBeDefined();
            expect(app.metadataCache.getCache).toBeDefined();
            expect(app.metadataCache.fileToLinktext).toBeDefined();
            expect(app.metadataCache.getFirstLinkpathDest).toBeDefined();
            expect(app.metadataCache.resolvedLinks).toBeDefined();
            expect(app.metadataCache.unresolvedLinks).toBeDefined();
            expect(app.metadataCache.getCachedFiles).toBeDefined();
        });
    });
    describe('Keymap', () => {
        it('should have an initialized keymap with mocked methods', () => {
            expect(app.keymap).toBeDefined();
            expect(app.keymap.pushScope).toBeDefined();
            expect(app.keymap.popScope).toBeDefined();
        });
    });
    describe('Scope', () => {
        it('should have an initialized scope with mocked methods', () => {
            expect(app.scope).toBeDefined();
            expect(app.scope.register).toBeDefined();
            expect(app.scope.unregister).toBeDefined();
        });
    });
    describe('Commands', () => {
        it('should have initialized commands with mocked methods', () => {
            expect(app.commands).toBeDefined();
            expect(app.commands.executeCommand).toBeDefined();
            expect(app.commands.findCommand).toBeDefined();
            expect(app.commands.listCommands).toBeDefined();
            expect(app.commands.removeCommand).toBeDefined();
            expect(app.commands.addCommand).toBeDefined();
        });
    });
    describe('FileManager', () => {
        it('should have an initialized fileManager with mocked methods', () => {
            expect(app.fileManager).toBeDefined();
            expect(app.fileManager.processFrontMatter).toBeDefined();
            expect(app.fileManager.save).toBeDefined();
            expect(app.fileManager.createNewMarkdownFile).toBeDefined();
            expect(app.fileManager.generateMarkdownLink).toBeDefined();
            expect(app.fileManager.getNewFileParent).toBeDefined();
            expect(app.fileManager.renameFile).toBeDefined();
            expect(app.fileManager.getAvailablePathForAttachment).toBeDefined();
            expect(app.fileManager.trashFile).toBeDefined();
        });
    });
});
