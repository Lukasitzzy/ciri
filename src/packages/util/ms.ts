/**
 * license notice
 * The MIT License (MIT)

Copyright (c) 2018-2020 iCrawl
Copyright (c) 2016 Zeit, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
const enum DURATION {
    SECOND = 1000,
    MINUTE = SECOND * 60,
    HOUR = MINUTE * 60,
    DAY = HOUR * 24,
    WEEK = DAY * 7,
    YEAR = DAY * 365.25,
}

const SEPERATORS = [' ', '.', ',', '-'];
const REGEX = /^(-?(?:\d+)?\.?\d+) *([a-z]+)?$/;

function tokenize(str: string) {
    const units = [];
    let buf = '';
    let letter = false;
    for (const char of str) {
        if (SEPERATORS.includes(char)) {
            buf += char;
        } else if (isNaN(parseInt(char, 10))) {
            buf += char;
            letter = true;
        } else {
            if (letter) {
                units.push(buf.trim());
                buf = '';
            }
            letter = false;
            buf += char;
        }
    }
    if (buf.length) {
        units.push(buf.trim());
    }
    return units;
}

function convert(num: number, type: string) {
    switch (type) {
        case 'years':
        case 'year':
        case 'yrs':
        case 'yr':
        case 'y':
            return num * DURATION.YEAR;
        case 'weeks':
        case 'week':
        case 'w':
            return num * DURATION.WEEK;
        case 'days':
        case 'day':
        case 'd':
            return num * DURATION.DAY;
        case 'hours':
        case 'hour':
        case 'hrs':
        case 'hr':
        case 'h':
            return num * DURATION.HOUR;
        case 'minutes':
        case 'minute':
        case 'mins':
        case 'min':
        case 'm':
            return num * DURATION.MINUTE;
        case 'seconds':
        case 'second':
        case 'secs':
        case 'sec':
        case 's':
            return num * DURATION.SECOND;
    }
    return num;
}

function pluralize(ms: number, msAbs: number, n: number, long: string, short: string, l = false) {
    const plural = msAbs >= n * 1.5;
    return `${Math.round(ms / n)}${l ? ` ${long}${plural ? 's' : ''}` : short}`;
}

function ms(val: string, long?: boolean): number;
function ms(val: number, long?: boolean): string;
function ms(val: string | number, long = false): number | string {
    let abs;
    let ms = 0;
    if (typeof val === 'string' && val.length) {
        if (val.length < 101) {
            const units = tokenize(val.toLowerCase());
            for (const unit of units) {
                const fmt = REGEX.exec(unit);
                if (fmt) {
                    abs = parseFloat(fmt[1]);
                    ms += convert(abs, fmt[2]);
                }
            }
            return ms;
        }
    }

    if (typeof val === 'number' && isFinite(val)) {
        abs = Math.abs(val);
        if (abs >= DURATION.DAY) return pluralize(val, abs, DURATION.DAY, 'day', 'd', long);
        if (abs >= DURATION.HOUR) return pluralize(val, abs, DURATION.HOUR, 'hour', 'h', long);
        if (abs >= DURATION.MINUTE) return pluralize(val, abs, DURATION.MINUTE, 'minute', 'm', long);
        if (abs >= DURATION.SECOND) return pluralize(val, abs, DURATION.SECOND, 'second', 's', long);
        return `${val}${long ? ' ' : ''}ms`;
    }

    throw new Error(`Value is an empty string or an invalid number. Value=${JSON.stringify(val)}`);
}

export { ms };
export default ms;