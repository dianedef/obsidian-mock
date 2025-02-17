import { vi } from 'vitest';
import { View } from 'obsidian';
import type { TAbstractFile, TFolder, WorkspaceLeaf } from 'obsidian';
import obsidian from '../setup';

export class FileExplorerView extends View {
    files: Map<string, TAbstractFile> = new Map();
    collapsedFolders: Set<string> = new Set();
    currentFilter: string = '';
    sortMethod: 'name' | 'mtime' = 'name';
    private selectedFile: TAbstractFile | null = null;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        this.icon = 'folder';
        
        // Création de l'interface utilisateur
        this.containerEl.classList.add('file-explorer-view');
        
        // Création de la barre d'outils
        const toolbar = document.createElement('div');
        toolbar.classList.add('file-explorer-toolbar');
        this.containerEl.appendChild(toolbar);
        
        // Bouton de création de fichier
        const newFileButton = document.createElement('button');
        newFileButton.classList.add('file-explorer-new-file');
        newFileButton.textContent = 'Nouveau fichier';
        toolbar.appendChild(newFileButton);
        
        // Bouton de création de dossier
        const newFolderButton = document.createElement('button');
        newFolderButton.classList.add('file-explorer-new-folder');
        newFolderButton.textContent = 'Nouveau dossier';
        toolbar.appendChild(newFolderButton);
        
        // Zone de l'arborescence des fichiers
        this.contentEl = document.createElement('div');
        this.contentEl.classList.add('file-explorer-files');
        this.containerEl.appendChild(this.contentEl);
    }

    getViewType(): string {
        return 'file-explorer';
    }

    getDisplayText(): string {
        return 'File Explorer';
    }

    addFile(file: TAbstractFile): void {
        this.files.set(file.path, file);
        this.trigger('file-added', file);
    }

    removeFile(file: TAbstractFile): void {
        this.files.delete(file.path);
        if (this.selectedFile === file) {
            this.selectedFile = null;
        }
        this.trigger('file-deleted', file);
    }

    renameFile(file: TAbstractFile, oldPath: string): void {
        this.files.delete(oldPath);
        this.files.set(file.path, file);
        this.trigger('file-renamed', file, oldPath);
    }

    getAllFiles(): TAbstractFile[] {
        return Array.from(this.files.values());
    }

    getVisibleFiles(): TAbstractFile[] {
        let files = this.getAllFiles();
        if (this.currentFilter) {
            files = files.filter(file => file.path.endsWith(this.currentFilter));
        }
        return this.sortFiles(files);
    }

    sortFiles(files: TAbstractFile[]): TAbstractFile[] {
        return files.sort((a, b) => {
            if (this.sortMethod === 'name') {
                return a.path.localeCompare(b.path);
            } else {
                const statA = (a as any).stat?.mtime || 0;
                const statB = (b as any).stat?.mtime || 0;
                return statB - statA;
            }
        });
    }

    sortBy(method: 'name' | 'mtime'): void {
        this.sortMethod = method;
        this.trigger('sort-changed', method);
    }

    setFilter(filter: string): void {
        this.currentFilter = filter;
        this.trigger('filter-changed', filter);
    }

    collapseFolder(folder: TFolder): void {
        this.collapsedFolders.add(folder.path);
        this.trigger('folder-collapsed', folder);
    }

    expandFolder(folder: TFolder): void {
        this.collapsedFolders.delete(folder.path);
        this.trigger('folder-expanded', folder);
    }

    isFolderCollapsed(folder: TFolder): boolean {
        return this.collapsedFolders.has(folder.path);
    }

    getFolderStructure(folder: TFolder): { folder: TFolder, children: TAbstractFile[] } {
        const children = this.getAllFiles().filter(file => 
            file.path.startsWith(folder.path + '/') && 
            !file.path.slice(folder.path.length + 1).includes('/')
        );
        return { folder, children };
    }

    getState(): any {
        return {
            collapsedFolders: Array.from(this.collapsedFolders),
            sortMethod: this.sortMethod,
            filter: this.currentFilter
        };
    }

    setViewState(state: any): Promise<void> {
        if (state.collapsedFolders) {
            this.collapsedFolders = new Set(state.collapsedFolders);
        }
        if (state.sortMethod) {
            this.sortMethod = state.sortMethod;
        }
        if (state.filter) {
            this.currentFilter = state.filter;
        }
        return Promise.resolve();
    }

    // Méthodes de gestion des fichiers
    addFile = vi.fn().mockImplementation((file: TAbstractFile): void => {
        this.files.set(file.path, file);
        this.trigger('file-created', file);
    });

    renameFile = vi.fn().mockImplementation((file: TAbstractFile, newPath: string): void => {
        const oldPath = file.path;
        this.files.delete(oldPath);
        file.path = newPath;
        this.files.set(newPath, file);
        this.trigger('file-renamed', file, oldPath);
    });

    getAllFiles = vi.fn().mockImplementation((): TAbstractFile[] => {
        return Array.from(this.files.values());
    });

    sortBy = vi.fn().mockImplementation((method: 'name' | 'mtime'): void => {
        this.sortMethod = method;
        const files = this.getAllFiles();
        if (method === 'name') {
            files.sort((a, b) => a.name.localeCompare(b.name));
        } else if (method === 'mtime') {
            files.sort((a, b) => (b.stat?.mtime || 0) - (a.stat?.mtime || 0));
        }
    });

    // Méthodes de navigation
    revealFile = vi.fn().mockImplementation((file: TAbstractFile): void => {
        // Simule l'expansion des dossiers parents et le défilement vers le fichier
        this.selectFile(file);
    });

    // Méthodes d'interface utilisateur
    selectFile(file: TAbstractFile): void {
        this.selectedFile = file;
        this.refresh();
    }

    getSelectedFile(): TAbstractFile | null {
        return this.selectedFile;
    }

    refresh(): void {
        while (this.contentEl.firstChild) {
            this.contentEl.removeChild(this.contentEl.firstChild);
        }
        
        const sortedFiles = this.sortFiles(Array.from(this.files.values()));
        
        for (const file of sortedFiles) {
            const fileEl = document.createElement('div');
            fileEl.classList.add('file-explorer-item');
            
            if ('children' in file) {
                fileEl.classList.add('file-explorer-folder');
            } else {
                fileEl.classList.add('file-explorer-file');
            }

            if (file === this.selectedFile) {
                fileEl.classList.add('is-selected');
            }

            fileEl.textContent = file.name;
            fileEl.addEventListener('click', () => this.selectFile(file));
            this.contentEl.appendChild(fileEl);
        }
    }

    // Méthodes de drag & drop
    onDragStart = vi.fn().mockImplementation((event: DragEvent, file: TAbstractFile): void => {
        event.dataTransfer?.setData('text/plain', file.path);
        this.trigger('drag-start', file);
    });

    onDrop = vi.fn().mockImplementation((event: DragEvent, target: TFolder): void => {
        const file = this.getSelectedFile();
        if (file) {
            const oldPath = file.path;
            const newPath = `${target.path}/${file.name}`;
            this.trigger('file-moved', file, oldPath, newPath);
        }
    });

    // Méthodes de recherche
    search = vi.fn().mockImplementation((query: string): TAbstractFile[] => {
        const normalizedQuery = query.toLowerCase();
        return this.getAllFiles().filter((file: TAbstractFile) => 
            file.path.toLowerCase().includes(normalizedQuery)
        );
    });
} 
