import { vi } from 'vitest';
import obsidian from '../setup';
export class FileExplorerView extends obsidian.ItemView {
    constructor(leaf) {
        super(leaf);
        this.files = new Map();
        this.selectedFile = null;
        // Méthodes de gestion des fichiers
        this.addFile = vi.fn().mockImplementation((file) => {
            this.files.set(file.path, file);
            this.refresh();
        });
        this.removeFile = vi.fn().mockImplementation((file) => {
            this.files.delete(file.path);
            if (this.selectedFile === file) {
                this.selectedFile = null;
            }
            this.refresh();
        });
        this.selectFile = vi.fn().mockImplementation((file) => {
            this.selectedFile = file;
            this.refresh();
        });
        this.getSelectedFile = vi.fn().mockImplementation(() => {
            return this.selectedFile;
        });
        this.getAllFiles = vi.fn().mockImplementation(() => {
            return Array.from(this.files.values());
        });
        // Méthodes de navigation
        this.revealFile = vi.fn().mockImplementation((file) => {
            // Simule l'expansion des dossiers parents et le défilement vers le fichier
            this.selectFile(file);
        });
        // Méthodes d'interface utilisateur
        this.refresh = vi.fn().mockImplementation(() => {
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
                }
                else {
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
        this.handleDrop = vi.fn().mockImplementation((_event) => { });
        // Méthodes de recherche
        this.search = vi.fn().mockImplementation((query) => {
            const normalizedQuery = query.toLowerCase();
            return this.getAllFiles().filter((file) => file.path.toLowerCase().includes(normalizedQuery));
        });
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
    getViewType() {
        return 'file-explorer';
    }
    getDisplayText() {
        return 'Explorateur de fichiers';
    }
}
