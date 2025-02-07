import { describe, it, expect, beforeEach } from 'vitest';
import { 
    BaseComponent,
    arrayBufferToBase64,
    arrayBufferToHex,
    base64ToArrayBuffer
} from '../../__mocks__/components/base-component';

describe('Fonctions utilitaires', () => {
    describe('arrayBufferToBase64', () => {
        it('devrait convertir correctement un ArrayBuffer en Base64', () => {
            const buffer = new Uint8Array([72, 101, 108, 108, 111]).buffer; // "Hello" en ASCII
            const result = arrayBufferToBase64(buffer);
            expect(result).toBe('SGVsbG8='); // "Hello" en Base64
        });
    });

    describe('arrayBufferToHex', () => {
        it('devrait convertir correctement un ArrayBuffer en hexadécimal', () => {
            const buffer = new Uint8Array([72, 101, 108, 108, 111]).buffer; // "Hello" en ASCII
            const result = arrayBufferToHex(buffer);
            expect(result).toBe('48656c6c6f'); // "Hello" en hexadécimal
        });
    });

    describe('base64ToArrayBuffer', () => {
        it('devrait convertir correctement une chaîne Base64 en ArrayBuffer', () => {
            const base64 = 'SGVsbG8='; // "Hello" en Base64
            const result = base64ToArrayBuffer(base64);
            const bytes = new Uint8Array(result);
            expect(Array.from(bytes)).toEqual([72, 101, 108, 108, 111]); // "Hello" en ASCII
        });
    });
});

describe('BaseComponent', () => {
    let component: BaseComponent;

    beforeEach(() => {
        component = new BaseComponent();
    });

    describe('Constructeur', () => {
        it('devrait initialiser avec disabled à false', () => {
            expect(component.disabled).toBe(false);
        });
    });

    describe('setDisabled', () => {
        it('devrait mettre à jour la propriété disabled', () => {
            component.setDisabled(true);
            expect(component.disabled).toBe(true);

            component.setDisabled(false);
            expect(component.disabled).toBe(false);
        });

        it('devrait retourner this pour le chaînage', () => {
            const result = component.setDisabled(true);
            expect(result).toBe(component);
        });
    });

    describe('then', () => {
        it('devrait exécuter le callback avec le composant', () => {
            let called = false;
            let passedComponent: BaseComponent | null = null;

            component.then((comp) => {
                called = true;
                passedComponent = comp;
            });

            expect(called).toBe(true);
            expect(passedComponent).toBe(component);
        });

        it('devrait retourner this pour le chaînage', () => {
            const result = component.then(() => {});
            expect(result).toBe(component);
        });

        it('devrait permettre le chaînage avec d\'autres méthodes', () => {
            let called = false;
            
            component
                .setDisabled(true)
                .then(() => {
                    called = true;
                })
                .setDisabled(false);

            expect(called).toBe(true);
            expect(component.disabled).toBe(false);
        });
    });
}); 