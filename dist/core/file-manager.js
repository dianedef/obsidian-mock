export class FileManager {
    processFrontMatter(_content) {
        // Mock implementation
        return {};
    }
    async save(_file, _content) {
        // Mock implementation
        return Promise.resolve();
    }
    async createNewMarkdownFile(_folder, _filename, _content) {
        // Mock implementation
        return Promise.resolve();
    }
    generateMarkdownLink(_file, _sourcePath, _subpath, _alias) {
        // Mock implementation
        return '';
    }
    async getNewFileParent() {
        // Mock implementation
        return {};
    }
    async renameFile(_file, _newPath) {
        // Mock implementation
        return Promise.resolve();
    }
    async getAvailablePathForAttachment(_filename, _file) {
        // Mock implementation
        return '';
    }
    async trashFile(_file) {
        // Mock implementation
        return Promise.resolve();
    }
}
