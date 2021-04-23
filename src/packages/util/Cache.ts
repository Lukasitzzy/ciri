
export class Cache<K extends string | number | symbol, V extends any> extends Map<K, V> {
    constructor() {
        super();
    }

    array(): [K, V][] {
        return [...Object.entries(this) as [K, V][]];
    }

    find(fn: (value: V, key: K, index: number) => boolean): V |undefined {

        const entries = Object.entries(this) as [K, V][];

        for (let i = 0; i < this.size; i++) {
            const  [k, v]  = entries[i];
            if (fn(v, k, i)) return v;
        }
        return undefined;


    }

    filter(fn: (value: V, key: K, index: number) => boolean): Cache<K, V> {

        const entries = Object.entries(this) as [K, V][];
        const copy = new Cache<K, V>();
        for (let i = 0; i < this.size; i++) {
            const [key, value] = entries[i];
            if (fn(value, key, i)) {
                copy.set(key, value);
            }

        }

        return copy;


    }


}
