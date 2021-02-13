import * as chalk from 'chalk';
import *  as colorNames from 'color-name';


export class ColorConverter {
    constructor() {
        throw new Error('not initialable');

    }


    public static hextoRgB(hex: string): colorNames.RGB {

        const rgb: [number, number, number] = [0, 0, 0];

        return rgb;
    }

    public static rgbToHex(rgb: colorNames.RGB): string {
        const str = '';


        return str;
    }


    public static hslToHex(hsl: any): string {
        return '';
    }
}

export class ConsoleColor { }