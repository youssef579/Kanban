declare global {
    interface Array<T> {
        with(index: number, value: T): T[];
        toSpliced(start: number, deleteCount: number, ...items: T[]): T[];
    }
}
export {};
