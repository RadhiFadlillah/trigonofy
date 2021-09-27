import type { Point } from './points';
export interface PatternOptions {
    width?: number;
    height?: number;
    points?: Point[];
    palette?: string[];
}
export declare class Pattern {
    width: number;
    height: number;
    points: Point[];
    palette: string[];
    constructor(opts?: PatternOptions);
    renderRandom(ctx: CanvasRenderingContext2D, { lineWidth, gradientAngle }?: {
        lineWidth?: number;
        gradientAngle?: any;
    }): void;
    renderTriangle(ctx: CanvasRenderingContext2D, { lineWidth, gradientAngle }?: {
        lineWidth?: number;
        gradientAngle?: any;
    }): void;
    renderVoronoi(ctx: CanvasRenderingContext2D, { lineWidth, gradientAngle }?: {
        lineWidth?: number;
        gradientAngle?: any;
    }): void;
    _initiateContext(ctx: CanvasRenderingContext2D, lineWidth: number, angle: number): void;
    _createGradient(ctx: CanvasRenderingContext2D, angle: number, palette?: string[]): CanvasGradient;
}
