import chroma from 'chroma-js';
import { Point } from './points';
export declare function randomEnum(enumeration: Record<string, any>): number;
export declare function randomInt(min: number, max: number): number;
export declare function createGradient(ctx: CanvasRenderingContext2D, width: number, height: number, palette: string[], angle: number): CanvasGradient;
export declare function getCanvasColor(ctx: CanvasRenderingContext2D, x: number, y: number): chroma.Color;
export declare function drawPolygon(ctx: CanvasRenderingContext2D, vertices: Point[]): void;
