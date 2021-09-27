export declare type Point = [number, number];
export declare class Points {
    static random(width: number, height: number, cellSize?: number): Point[];
    static uniform(width: number, height: number, cellSize?: number): Point[];
    static grid(width: number, height: number, cellSize?: number, variance?: number): Point[];
}
