import type { Events as IEvents, EventRef } from 'obsidian';
export interface MockEventRef extends EventRef {
    id: string;
}
export declare class Events implements IEvents {
    private eventRefs;
    private nextEventId;
    on(name: string, callback: (...data: any) => any, ctx?: any): MockEventRef;
    off(name: string, callback: (...data: any) => any): void;
    offref(ref: MockEventRef): void;
    trigger(name: string, ...data: any[]): void;
    tryTrigger(name: string, ...data: any[]): void;
}
