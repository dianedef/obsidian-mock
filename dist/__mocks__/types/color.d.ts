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
export interface ColorComponent {
    getValue(): string;
    setValue(value: string): this;
    onChange(callback: (value: string) => any): this;
    setDisabled(disabled: boolean): this;
}
