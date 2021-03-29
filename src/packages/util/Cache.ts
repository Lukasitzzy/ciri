
export class Cache<K extends string | number | symbol, V extends any> extends Map<K, V> {
    constructor() {
        super();
    }
}
