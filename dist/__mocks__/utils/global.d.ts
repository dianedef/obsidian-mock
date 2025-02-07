declare global {
    interface EventListenerInfo {
        selector: string;
        listener: Function;
        options?: boolean | AddEventListenerOptions;
        callback: Function;
    }
    interface Window {
        isBoolean: (obj: any) => obj is boolean;
        fish: (selector: string) => HTMLElement | null;
        fishAll: (selector: string) => HTMLElement[];
        ajax: Function;
        ajaxPromise: Function;
        ready: () => Promise<void>;
        sleep: (ms: number) => Promise<void>;
        nextFrame: () => Promise<void>;
        activeWindow: Window;
        activeDocument: Document;
    }
    interface Element {
        _EVENTS?: {
            [K in keyof HTMLElementEventMap]?: EventListenerInfo[];
        };
        show(): void;
        hide(): void;
        toggle(show: boolean): void;
        toggleVisibility(visible: boolean): void;
        isShown(): boolean;
        setCssStyles(styles: Partial<CSSStyleDeclaration>): void;
        setCssProps(props: Record<string, string>): void;
        on<K extends keyof HTMLElementEventMap>(type: K, selector: string, listener: (this: HTMLElement, ev: HTMLElementEventMap[K], delegateTarget: HTMLElement) => void, options?: boolean | AddEventListenerOptions): void;
        off<K extends keyof HTMLElementEventMap>(type: K, selector: string, listener: (this: HTMLElement, ev: HTMLElementEventMap[K], delegateTarget: HTMLElement) => void, options?: boolean | EventListenerOptions): void;
        trigger(eventType: string): void;
        onClickEvent(listener: (this: HTMLElement, ev: MouseEvent) => any, options?: boolean | AddEventListenerOptions): void;
        onNodeInserted(listener: () => any, once?: boolean): () => void;
        onWindowMigrated(listener: (win: Window) => any): () => void;
        getText(): string;
        setText(val: string | DocumentFragment): void;
        addClass(...classes: string[]): void;
        addClasses(classes: string[]): void;
        removeClass(...classes: string[]): void;
        removeClasses(classes: string[]): void;
        toggleClass(classes: string | string[], value?: boolean): void;
        hasClass(cls: string): boolean;
        setAttr(name: string, value: string | number | boolean | null): void;
        setAttrs(attrs: Record<string, string | number | boolean | null>): void;
        getAttr(name: string): string | null;
        matchParent(selector: string, lastParent?: Element): Element | null;
        getCssPropertyValue(prop: string, pseudo?: string): string;
        isActiveElement(): boolean;
        find: (selector: string) => Element | null;
        findAll: (selector: string) => HTMLElement[];
        findAllSelf: (selector: string) => HTMLElement[];
    }
    interface Document {
        _EVENTS?: {
            [K in keyof DocumentEventMap]?: EventListenerInfo[];
        };
        on<K extends keyof DocumentEventMap>(type: K, selector: string, listener: (this: Document, ev: DocumentEventMap[K], delegateTarget: HTMLElement) => any, options?: boolean | AddEventListenerOptions): void;
        off<K extends keyof DocumentEventMap>(type: K, selector: string, listener: (this: Document, ev: DocumentEventMap[K], delegateTarget: HTMLElement) => any, options?: boolean | AddEventListenerOptions): void;
    }
    interface Node {
        detach(): void;
        empty(): void;
        insertAfter<T extends Node>(node: T, child: Node | null): T;
        indexOf(other: ChildNode): number;
        setChildrenInPlace(children: Node[]): void;
        appendText(val: string): void;
        instanceOf<T>(type: new () => T): this is T;
        doc: Document;
        win: Window;
        constructorWin: Window;
        createEl<K extends keyof HTMLElementTagNameMap>(tag: K, o?: DomElementInfo | string, callback?: (el: HTMLElementTagNameMap[K]) => void): HTMLElementTagNameMap[K];
        createDiv(o?: DomElementInfo | string, callback?: (el: HTMLDivElement) => void): HTMLDivElement;
        createSpan(o?: DomElementInfo | string, callback?: (el: HTMLSpanElement) => void): HTMLSpanElement;
        createSvg<K extends keyof SVGElementTagNameMap>(tag: K, o?: SvgElementInfo | string, callback?: (el: SVGElementTagNameMap[K]) => void): SVGElementTagNameMap[K];
    }
    interface DomElementInfo {
        cls?: string | string[];
        text?: string | DocumentFragment;
        attr?: {
            [key: string]: string | number | boolean | null;
        };
        title?: string;
        parent?: Node;
        value?: string;
        type?: string;
        prepend?: boolean;
        placeholder?: string;
        href?: string;
    }
    interface SvgElementInfo {
        cls?: string | string[];
        attr?: {
            [key: string]: string | number | boolean | null;
        };
        parent?: Node;
        prepend?: boolean;
    }
    interface UIEvent extends Event {
        targetNode: Node | null;
        win: Window;
        doc: Document;
        instanceOf<T>(type: {
            new (...data: any[]): T;
        }): this is T;
    }
    interface AjaxOptions {
        method?: 'GET' | 'POST';
        url: string;
        success?: (response: any, req: XMLHttpRequest) => any;
        error?: (error: any, req: XMLHttpRequest) => any;
        data?: object | string | ArrayBuffer;
        headers?: Record<string, string>;
        withCredentials?: boolean;
        req?: XMLHttpRequest;
    }
}
export declare const setupGlobalMocks: () => void;
