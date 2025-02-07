import { vi } from 'vitest';
import type { TAbstractFile, TFile, TFolder, WorkspaceLeaf } from 'obsidian';
import obsidian from '../setup';

export class FileExplorerView extends obsidian.ItemView {
    private files: Map<string, TAbstractFile> = new Map();
    private selectedFile: TAbstractFile | null = null;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
        
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
        return 'Explorateur de fichiers';
    }

    // Méthodes de gestion des fichiers
    addFile = vi.fn().mockImplementation((file: TAbstractFile): void => {
        this.files.set(file.path, file);
        this.refresh();
    });

    removeFile = vi.fn().mockImplementation((file: TAbstractFile): void => {
        this.files.delete(file.path);
        if (this.selectedFile === file) {
            this.selectedFile = null;
        }
        this.refresh();
    });

    selectFile = vi.fn().mockImplementation((file: TAbstractFile | null): void => {
        this.selectedFile = file;
        this.refresh();
    });

    getSelectedFile = vi.fn().mockImplementation((): TAbstractFile | null => {
        return this.selectedFile;
    });

    getAllFiles = vi.fn().mockImplementation((): TAbstractFile[] => {
        return Array.from(this.files.values());
    });

    // Méthodes de navigation
    revealFile = vi.fn().mockImplementation((file: TAbstractFile): void => {
        // Simule l'expansion des dossiers parents et le défilement vers le fichier
        this.selectFile(file);
    });

    // Méthodes d'interface utilisateur
    private refresh = vi.fn().mockImplementation((): void => {
        while (this.contentEl.firstChild) {
            this.contentEl.removeChild(this.contentEl.firstChild);
        }
        
        // Trie les fichiers par chemin
        const sortedFiles = Array.from(this.files.values())
            .sort((a, b) => a.path.localeCompare(b.path));

        // Recrée l'arborescence
        for (const file of sortedFiles) {
            const fileEl = document.createElement('div');
            fileEl.classList.add('file-explorer-item');
            
            // Ajoute la classe appropriée selon le type
            if ('children' in file) {
                fileEl.classList.add('file-explorer-folder');
            } else {
                fileEl.classList.add('file-explorer-file');
            }

            // Ajoute la classe selected si le fichier est sélectionné
            if (file === this.selectedFile) {
                fileEl.classList.add('is-selected');
            }

            fileEl.textContent = file.name;
            fileEl.addEventListener('click', () => this.selectFile(file));
            this.contentEl.appendChild(fileEl);
        }
    });

    // Méthodes de drag & drop
    handleDrop = vi.fn().mockImplementation((_event: DragEvent): void => {});

    // Méthodes de recherche
    search = vi.fn().mockImplementation((query: string): TAbstractFile[] => {
        const normalizedQuery = query.toLowerCase();
        return this.getAllFiles().filter((file: TAbstractFile) => 
            file.path.toLowerCase().includes(normalizedQuery)
        );
    });
} 
