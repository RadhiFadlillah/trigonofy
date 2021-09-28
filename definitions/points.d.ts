export declare type Point = [number, number];
export declare enum PointsType {
    Uniform = 0,
    Grid = 1
}
export interface UniformPoints {
    type: PointsType.Uniform;
    cellSize?: number;
}
export interface GridPoints {
    type: PointsType.Grid;
    cellSize?: number;
    variance?: number;
}
export declare function generatePoints(width: number, height: number, opts?: UniformPoints | GridPoints): Point[];
