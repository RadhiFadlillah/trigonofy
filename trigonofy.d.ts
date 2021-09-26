declare module "utils" {
    export function randomInt(min: number, max: number): number;
}
declare module "points" {
    export type Point = [number, number];
    export class Points {
        static random(width: number, height: number, cellSize?: number): Point[];
        static uniform(width: number, height: number, cellSize?: number): Point[];
        static grid(width: number, height: number, cellSize?: number, variance?: number): Point[];
    }
}
declare module "palette" {
    export class Palette {
        static random(baseColor?: string): string[];
        static chaos(baseColor?: string): string[];
        static complementary(baseColor?: string): string[];
        static monochromatic(baseColor?: string): string[];
        static analogous(baseColor?: string): string[];
        static triadic(baseColor?: string): string[];
        static tetradic(baseColor?: string): string[];
        static colorbrewer(key?: string): string[];
    }
}
declare module "pattern" {
    import type { Point } from "points";
    export interface PatternOptions {
        width?: number;
        height?: number;
        points?: Point[];
        palette?: string[];
    }
    export class Pattern {
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
}
declare module "index" {
    import { Points } from "points";
    import { Palette } from "palette";
    import { Pattern } from "pattern";
    import type { PatternOptions } from "pattern";
    export { Points, Palette, Pattern };
    export default function (opts?: PatternOptions): Pattern;
}
