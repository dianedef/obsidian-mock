import type { ColorComponent } from 'obsidian';

export type RGB = {
    r: number;
    g: number;
    b: number;
};

export type HSL = {
    h: number;
    s: number;
    l: number;
};

export type Color = string | RGB | HSL;

export type { ColorComponent }; 