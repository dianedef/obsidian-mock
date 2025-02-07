import { Component } from '../components/component';
interface WindowDimensions {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
}
export declare class WorkspaceWindow extends Component {
    containerEl: HTMLElement;
    isOpen: boolean;
    constructor(dimensions?: WindowDimensions);
    onResize(): void;
    onClose(): void;
    close(): void;
    resize(): void;
}
export {};
