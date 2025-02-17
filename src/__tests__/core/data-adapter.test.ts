import { describe, it, expect, beforeEach } from 'vitest';
import { DataAdapter } from '../../__mocks__/core/data-adapter';


describe('DataAdapter', () => {
    let adapter: DataAdapter;


    beforeEach(() => {
        adapter = new DataAdapter();
    });


    describe('Basic Operations', () => {
        it('should have a name', () => {
            expect(adapter.getName()).toBe('mock-data-adapter');
        });

        it('should check the existence of files', async () => {
            await adapter.write('test.md', 'content');
            expect(await adapter.exists('test.md')).toBe(true);
            expect(await adapter.exists('nonexistent.md')).toBe(false);
        });

        it('should get file stats', async () => {
            await adapter.write('test.md', 'content');
            const stats = await adapter.stat('test.md');
            expect(stats.type).toBe('file');
            expect(stats.size).toBe(7);
            expect(stats.ctime).toBeDefined();
            expect(stats.mtime).toBeDefined();
        });
    });

    describe('File Operations', () => {
        it('should read and write text files', async () => {
            await adapter.write('test.md', 'content');
            expect(await adapter.read('test.md')).toBe('content');
        });

        it('should read and write binary files', async () => {
            const data = new TextEncoder().encode('content').buffer;
            await adapter.writeBinary('test.bin', data);
            const result = await adapter.readBinary('test.bin');
            expect(new TextDecoder().decode(result)).toBe('content');
        });

        it('should delete files', async () => {
            await adapter.write('test.md', 'content');
            await adapter.remove('test.md');
            expect(await adapter.exists('test.md')).toBe(false);
        });

        it('should rename files', async () => {
            await adapter.write('test.md', 'content');
            await adapter.rename('test.md', 'new.md');
            expect(await adapter.exists('test.md')).toBe(false);
            expect(await adapter.exists('new.md')).toBe(true);
            expect(await adapter.read('new.md')).toBe('content');
        });

        it('should copy files', async () => {
            await adapter.write('test.md', 'content');
            await adapter.copy('test.md', 'copy.md');
            expect(await adapter.exists('test.md')).toBe(true);
            expect(await adapter.exists('copy.md')).toBe(true);
            expect(await adapter.read('copy.md')).toBe('content');
        });
    });

    describe('Folder Operations', () => {
        it('should create folders', async () => {
            await adapter.mkdir('folder');
            expect(await adapter.exists('folder')).toBe(true);
        });

        it('should list folder contents', async () => {
            await adapter.mkdir('folder');
            await adapter.write('folder/test1.md', 'content1');
            await adapter.write('folder/test2.md', 'content2');
            
            const list = await adapter.list('folder');
            expect(list.files).toContain('folder/test1.md');
            expect(list.files).toContain('folder/test2.md');
            expect(list.folders).toHaveLength(0);
        });

        it('should recursively delete folders', async () => {
            await adapter.mkdir('folder');
            await adapter.write('folder/test1.md', 'content1');
            await adapter.write('folder/test2.md', 'content2');
            
            await adapter.rmdir('folder', true);
            expect(await adapter.exists('folder')).toBe(false);
            expect(await adapter.exists('folder/test1.md')).toBe(false);
            expect(await adapter.exists('folder/test2.md')).toBe(false);
        });
    });

    describe('Trash Operations', () => {
        it('should move files to the system trash', async () => {
            await adapter.write('test.md', 'content');
            await adapter.trashSystem('test.md');
            expect(await adapter.exists('test.md')).toBe(false);
        });

        it('should move files to the local trash', async () => {
            await adapter.write('test.md', 'content');
            await adapter.trashLocal('test.md');
            expect(await adapter.exists('test.md')).toBe(false);
        });
    });

    describe('Resource Management', () => {
        it('should generate resource paths', () => {
            const path = adapter.getResourcePath('image.png');
            expect(path).toBe('app://local/image.png');
        });
    });

    describe('Error Management', () => {
        it('should handle errors reading non-existent files', async () => {
            await expect(adapter.read('nonexistent.md')).rejects.toThrow('File not found');
        });

        it('should handle errors reading binary non-existent files', async () => {
            await expect(adapter.readBinary('nonexistent.bin')).rejects.toThrow('File not found');
        });

        it('should handle errors getting stats of non-existent files', async () => {
            await expect(adapter.stat('nonexistent.md')).rejects.toThrow('File not found');
        });
    });
}); 