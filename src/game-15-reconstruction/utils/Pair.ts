// utils/Pair.ts
export class Pair<K, V> {
    constructor(private key: K, private value: V) { }

    public getKey(): K {
        return this.key;
    }

    public getValue(): V {
        return this.value;
    }

    public static from<K, V>(key: K, value: V): Pair<K, V> {
        return new Pair(key, value);
    }

    public toString(): string {
        return '[' + this.getKey() + ', ' + this.getValue() + ']'
    }
}