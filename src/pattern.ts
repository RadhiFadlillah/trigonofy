import chroma from 'chroma-js';
import { Points } from './points';
import { Palette } from './palette';
import { Delaunay, Voronoi } from 'd3-delaunay';
import type { Point } from './points';

export interface PatternOptions {
	width?: number;
	height?: number;
	points?: Point[];
	palette?: string[];
	gradientAngle?: number;
}

export class Pattern {
	width: number;
	height: number;
	delaunay: Delaunay<Delaunay.Point>;
	voronoi: Voronoi<Delaunay.Point>;

	constructor({
		width = 800,
		height = 600,
		points = [],
		palette = [],
		gradientAngle = undefined,
	}: PatternOptions = {}) {
		// Process arguments
		this.width = width;
		this.height = height;

		if (!validatePoints(points)) {
			points = Points.random(width, height);
		}

		if (!validatePalette(palette)) {
			palette = Palette.random();
		}

		if (!validateGradientAngle(gradientAngle)) {
			gradientAngle = Math.round(Math.random() * 360);
		}

		// Generate pattern
		const delaunay = Delaunay.from(points);
		const voronoi = delaunay.voronoi([0, 0, width, height]);

		// Create canvas
		const canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;
		document.body.appendChild(canvas);

		// Create gradient
		const ctx = canvas.getContext('2d');
		ctx.lineWidth = 2;

		const g1 = createGradient(ctx, width, height, palette, gradientAngle);
		const g2 = createGradient(ctx, width, height, palette, gradientAngle + 90);

		ctx.beginPath();
		ctx.strokeStyle = g1;
		delaunay.render(ctx);
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = g2;
		voronoi.render(ctx);
		ctx.stroke();
	}
}

function validatePoints(points?: any): boolean {
	if (!Array.isArray(points)) return false;
	if (points.length === 0) return false;

	return points.every((point) => {
		return (
			Array.isArray(point) &&
			point.length === 2 &&
			isFinite(point[0]) &&
			isFinite(point[1])
		);
	});
}

function validatePalette(palette?: any): boolean {
	if (!Array.isArray(palette)) return false;
	if (palette.length < 2) return false;

	return palette.every((color) => {
		return typeof color === 'string' && chroma.valid(color);
	});
}

function validateGradientAngle(angle?: number): boolean {
	return typeof angle === 'number' && isFinite(angle);
}

function createGradient(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	palette: string[],
	angle: number
): CanvasGradient {
	// Normalize angle
	angle = normalizeAngle(angle);
	if (angle > 180) angle -= 180;

	// Calculate gradient endpoints
	let [x0, y0] = [width / 2, 0];
	let [x1, y1] = [width / 2, height];
	if (angle !== 90) {
		// Calculate slope
		let m = Math.tan((angle * Math.PI) / 180);

		// Since we use center as zero point, for simplicity we will
		// calculate using quarter of area.
		let limitX = width / 2;
		let limitY = height / 2;
		let [x, y] = [limitX, m * limitX];
		if (y > limitY) [x, y] = [limitY / m, limitY];
		else if (y < -limitY) [x, y] = [-limitY / m, -limitY];

		// Create final endpoints
		[x1, y1] = [Math.round(x + width / 2), Math.round(y + height / 2)];
		[x0, y0] = [width - x1, height - y1];

		// If slope descending swap the points
		if (m < 0) {
			[x0, x1] = [x1, x0];
			[y0, y1] = [y1, y0];
		}
	}

	// Create gradient
	const paletteSize = palette.length;
	const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
	palette.forEach((color, i) => {
		gradient.addColorStop(i / (paletteSize - 1), color);
	});

	return gradient;
}

function normalizeAngle(angle: number): number {
	if (angle < 0) {
		while (angle < 0) angle += 360;
		return angle;
	} else if (angle > 360) {
		while (angle > 360) angle -= 360;
		return angle;
	} else {
		return angle;
	}
}
