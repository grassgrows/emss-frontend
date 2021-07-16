export interface Result<T, E> {
    value: T | undefined,
    error: E | undefined
}

export function runCatching<T, E>(func: () => T): Result<T, E> {
    try {
        const result = func()
        return {
            value: result,
            error: undefined
        }
    } catch (e) {
        return {
            value: undefined,
            error: e
        }
    }
}
