import type { Modal as IModal } from 'obsidian';
import { Events } from '../components/events';
export declare class Modal extends Events implements IModal {
    app: any;
    scope: any;
    containerEl: HTMLElement;
    modalEl: HTMLElement;
    titleEl: HTMLElement;
    contentEl: HTMLElement;
    shouldRestoreSelection: boolean;
    constructor(app: any);
    open(): void;
    close(): void;
    onOpen(): void;
    onClose(): void;
    setTitle: import("vitest/dist").Mock<any, any>;
    setContent: import("vitest/dist").Mock<any, any>;
}
