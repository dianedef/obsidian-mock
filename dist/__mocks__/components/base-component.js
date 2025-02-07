import { vi } from 'vitest';
/** @public */
export function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
/** @public */
export function arrayBufferToHex(data) {
    const bytes = new Uint8Array(data);
    return Array.from(bytes)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}
/** @public */
export function base64ToArrayBuffer(base64) {
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
export class BaseComponent {
    constructor() {
        /** @public */
        this.disabled = false;
        this.load = vi.fn();
        this.onload = vi.fn();
        this.unload = vi.fn();
        this.onunload = vi.fn();
        this.registerEvent = vi.fn();
        this.registerDomEvent = vi.fn();
        this.registerInterval = vi.fn().mockReturnValue(0);
        this.addChild = vi.fn().mockImplementation((child) => {
            return child;
        });
        this.removeChild = vi.fn().mockImplementation((child) => {
            return child;
        });
        this.register = vi.fn().mockImplementation((cb) => {
            cb();
        });
    }
    /**
     * Facilitates chaining
     * @public
     */
    then(cb) {
        cb(this);
        return this;
    }
    /**
     * @public
     */
    setDisabled(disabled) {
        this.disabled = disabled;
        return this;
    }
}
