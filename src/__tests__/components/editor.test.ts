import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EditorImpl } from '../../__mocks__/components/editor';
import type { EditorPosition, EditorSelection } from 'obsidian';

describe('EditorImpl', () => {
    let editor: EditorImpl;
    const mockView = { contentEl: document.createElement('div') };

    beforeEach(() => {
        editor = new EditorImpl(mockView as any);
    });

    describe('Gestion du contenu', () => {
        it('devrait initialiser avec un contenu vide', () => {
            expect(editor.getValue()).toBe('');
        });

        it('devrait mettre à jour le contenu via setValue', () => {
            editor.setValue('Nouveau contenu');
            expect(editor.getValue()).toBe('Nouveau contenu');
        });

        it('devrait déclencher un événement change lors de la modification du contenu', () => {
            const changeSpy = vi.fn();
            editor.on('change', changeSpy);
            editor.setValue('Nouveau contenu');
            expect(changeSpy).toHaveBeenCalledWith({ 
                from: null, 
                to: null, 
                text: ['Nouveau contenu'] 
            });
        });
    });

    describe('Gestion de l\'historique', () => {
        beforeEach(() => {
            editor.setValue('Premier');
            editor.setValue('Deuxième');
            editor.setValue('Troisième');
            // Afficher l'état initial
            console.log('État initial:', {
                content: editor.getValue(),
                history: (editor as any).history,
                historyIndex: (editor as any).historyIndex
            });
        });

        it('devrait permettre d\'annuler les modifications', () => {
            editor.undo();
            expect(editor.getValue()).toBe('Deuxième');
            editor.undo();
            expect(editor.getValue()).toBe('Premier');
        });

        it('devrait permettre de rétablir les modifications', () => {
            editor.undo();
            editor.undo();
            editor.redo();
            expect(editor.getValue()).toBe('Deuxième');
            editor.redo();
            expect(editor.getValue()).toBe('Troisième');
        });

        it('ne devrait pas aller au-delà des limites de l\'historique', () => {
            editor.undo();
            console.log('Après premier undo:', {
                content: editor.getValue(),
                history: (editor as any).history,
                historyIndex: (editor as any).historyIndex
            });

            editor.undo();
            console.log('Après deuxième undo:', {
                content: editor.getValue(),
                history: (editor as any).history,
                historyIndex: (editor as any).historyIndex
            });

            editor.undo();
            console.log('Après troisième undo:', {
                content: editor.getValue(),
                history: (editor as any).history,
                historyIndex: (editor as any).historyIndex
            });

            editor.undo(); // Ne devrait pas changer
            console.log('Après quatrième undo:', {
                content: editor.getValue(),
                history: (editor as any).history,
                historyIndex: (editor as any).historyIndex
            });

            expect(editor.getValue()).toBe('Premier');

            editor.redo();
            editor.redo();
            editor.redo();
            editor.redo(); // Ne devrait pas changer
            expect(editor.getValue()).toBe('Troisième');
        });
    });

    describe('Gestion des sélections', () => {
        const pos1: EditorPosition = { line: 0, ch: 0 };
        const pos2: EditorPosition = { line: 0, ch: 5 };
        const pos3: EditorPosition = { line: 1, ch: 0 };

        it('devrait gérer une sélection simple', () => {
            editor.setSelection(pos1, pos2);
            const selections = editor.getSelections();
            expect(selections).toHaveLength(1);
            expect(selections[0]).toEqual({ anchor: pos1, head: pos2 });
        });

        it('devrait gérer plusieurs sélections', () => {
            const multipleSelections: EditorSelection[] = [
                { anchor: pos1, head: pos2 },
                { anchor: pos2, head: pos3 }
            ];
            editor.setSelections(multipleSelections);
            expect(editor.getSelections()).toEqual(multipleSelections);
        });

        it('devrait mettre à jour la sélection lors du déplacement du curseur', () => {
            editor.setCursor(pos1);
            const selections = editor.getSelections();
            expect(selections).toHaveLength(1);
            expect(selections[0]).toEqual({ anchor: pos1, head: pos1 });
        });
    });

    describe('Opérations de texte', () => {
        beforeEach(() => {
            editor.setValue('Ligne 1\nLigne 2\nLigne 3');
        });

        it('devrait remplacer le texte dans une plage donnée', () => {
            editor.replaceRange('Nouvelle', { line: 0, ch: 0 }, { line: 0, ch: 5 });
            expect(editor.getValue()).toBe('Nouvelle 1\nLigne 2\nLigne 3');
        });

        it('devrait remplacer la sélection', () => {
            vi.spyOn(editor, 'getSelection').mockReturnValue('Ligne 1');
            editor.replaceSelection('Nouvelle ligne');
            expect(editor.getValue()).toBe('Nouvelle ligne\nLigne 2\nLigne 3');
        });

        it('devrait gérer les transactions', () => {
            editor.transaction({
                changes: {
                    from: { line: 0, ch: 0 },
                    to: { line: 0, ch: 7 },
                    text: 'Modifié'
                }
            });
            expect(editor.getValue()).toBe('Modifié');
        });
    });

    describe('Gestion des événements', () => {
        it('devrait permettre d\'ajouter et de retirer des écouteurs d\'événements', () => {
            const spy = vi.fn();
            const ref = editor.on('change', spy);
            
            editor.setValue('Test');
            expect(spy).toHaveBeenCalled();
            
            ref.unregister();
            editor.setValue('Test 2');
            expect(spy).toHaveBeenCalledTimes(1); // N'a pas été appelé une deuxième fois
        });

        it('devrait gérer plusieurs écouteurs pour le même événement', () => {
            const spy1 = vi.fn();
            const spy2 = vi.fn();
            
            editor.on('change', spy1);
            editor.on('change', spy2);
            
            editor.setValue('Test');
            expect(spy1).toHaveBeenCalled();
            expect(spy2).toHaveBeenCalled();
        });
    });
}); 