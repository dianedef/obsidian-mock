import type { Notice as INotice } from 'obsidian';
export declare class Notice implements INotice {
    noticeEl: HTMLElement;
    private duration;
    private hideCallback;
    constructor(message: string | DocumentFragment, duration?: number);
    setMessage(message: string | DocumentFragment): this;
    hide(): void;
}
