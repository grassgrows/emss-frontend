declare interface Array<T> {
    count<T>(this: T[], predicate: (value: T) => unknown): number;
}

Array.prototype.count = function <T>(this: T[], predicate: (value: T, index: number, array: T[]) => unknown) {
    return this.reduce((agg, item, index, array) => predicate(item, index, array) ? agg + 1 : agg, 0)
}
