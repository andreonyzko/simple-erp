export function sum(values: number[]): number {
    return values.reduce((total, value) => total + value, 0);
}

export function isPositive(value: number): boolean {
    return value > 0;
}

export function assert(condition: boolean, message: string): void {
    if(!condition) throw new Error(message);
}