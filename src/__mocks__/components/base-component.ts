import { vi } from 'vitest';
import type { Component as IComponent } from 'obsidian';

/** @public */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

/** @public */
export function arrayBufferToHex(data: ArrayBuffer): string {
    const bytes = new Uint8Array(data);
    return Array.from(bytes)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

/** @public */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * @public
 */
export class BaseComponent implements IComponent {
    /** @public */
    disabled: boolean = false;

    load = vi.fn();
    onload = vi.fn();
    unload = vi.fn();
    onunload = vi.fn();
    registerEvent = vi.fn();
    registerDomEvent = vi.fn();
    registerInterval = vi.fn().mockReturnValue(0);
    
    addChild = vi.fn().mockImplementation((child: BaseComponent) => {
        return child;
    });

    removeChild = vi.fn().mockImplementation((child: BaseComponent) => {
        return child;
    });

    register = vi.fn().mockImplementation((cb: () => any) => {
        cb();
    });

    /**
     * Facilitates chaining
     * @public
     */
    then(cb: (component: this) => any): this {
        cb(this);
        return this;
    }

    /**
     * @public
     */
    setDisabled(disabled: boolean): this {
        this.disabled = disabled;
        return this;
    }
} 