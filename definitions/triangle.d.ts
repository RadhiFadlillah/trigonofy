import { GridPoints, UniformPoints } from './points';
export interface TriangleOptions {
    width: number;
    height: number;
    palette?: string[];
    points?: UniformPoints | GridPoints;
    lineOnly?: boolean;
    lineWidth?: number;
    gradientAngle?: number;
}
export declare type VoronoiOptions = TriangleOptions;
export declare function Triangle(ctx: CanvasRenderingContext2D, opts: TriangleOptions): void;
export declare function Voronoi(ctx: CanvasRenderingContext2D, opts: VoronoiOptions): void;
