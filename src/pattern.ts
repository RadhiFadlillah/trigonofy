import chroma from 'chroma-js';
import { Points } from './points';
import { Palette } from './palette';
import { Delaunay, Voronoi } from 'd3-delaunay';
import type { Point } from './points';
import { randomInt } from './utils';

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

		// Create canvas
		const canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;
		document.body.appendChild(canvas);

		// Create fill gradient
		const ctx = canvas.getContext('2d');
		const fillGradient = createGradient(
			ctx,
			width,
			height,
			palette,
			gradientAngle
		);

		// Create border gradient
		const paletteLuminance = chroma.average(palette, 'lch').luminance();
		const strokePalette = palette.map((hex) => {
			let color = chroma(hex);
			if (paletteLuminance >= 0.5) color = color.darken();
			else color = color.brighten();
			return color.hex();
		});
		const strokeGradient = createGradient(
			ctx,
			width,
			height,
			strokePalette,
			gradientAngle
		);

		// Draw background
		ctx.fillStyle = fillGradient;
		ctx.fillRect(0, 0, width, height);

		// Draw delaunay triangles
		ctx.lineWidth = 1;
		ctx.strokeStyle = strokeGradient;

		// const delaunay = Delaunay.from(points);
		// [...delaunay.trianglePolygons()].forEach((points) => {
		// 	// Check if this triangle visible
		// 	let visible = points.some((p) => {
		// 		let [x, y] = [p[0], p[1]];
		// 		return x >= 0 && x <= width && y >= 0 && y <= height;
		// 	});

		// 	// Skip invisible triangles
		// 	if (!visible) return;

		// 	// Calculate centroid
		// 	let cx = (points[0][0] + points[1][0] + points[2][0]) / 3;
		// 	if (cx <= 0) cx = 1;
		// 	else if (cx >= width) cx = width - 1;

		// 	let cy = (points[0][1] + points[1][1] + points[2][1]) / 3;
		// 	if (cy <= 0) cy = 1;
		// 	else if (cy >= height) cy = height - 1;

		// 	// Fetch color at centroid
		// 	ctx.fillStyle = getColor(ctx, cx, cy);
		// 	ctx.beginPath();
		// 	ctx.moveTo(points[0][0], points[0][1]);
		// 	ctx.lineTo(points[1][0], points[1][1]);
		// 	ctx.lineTo(points[2][0], points[2][1]);
		// 	ctx.lineTo(points[3][0], points[3][1]);
		// 	ctx.fill();
		// 	ctx.stroke();
		// });

		const delaunay = Delaunay.from(points);
		const voronoi = delaunay.voronoi([0, 0, width, height]);
		[...voronoi.cellPolygons()].forEach((points, i) => {
			// Calculate centroid
			let [sumX, sumY] = [0, 0];
			let nVertice = points.length - 1;
			for (let i = 0; i < nVertice; i++) {
				sumX += points[i][0];
				sumY += points[i][1];
			}

			let cx = sumX / nVertice;
			let cy = sumY / nVertice;

			// Fetch color at centroid
			ctx.fillStyle = getColor(ctx, cx, cy);
			ctx.beginPath();
			ctx.moveTo(points[0][0], points[0][1]);
			for (let i = 1; i < points.length; i++) {
				ctx.lineTo(points[i][0], points[i][1]);
			}
			ctx.fill();
			ctx.stroke();
		});
	}

	// 	[...delaunay.trianglePolygons()].forEach((points, i) => {
	// 		// Calculate centroid
	// 		let cx = (points[0][0] + points[1][0] + points[2][0]) / 3;
	// 		if (cx <= 0) cx = 1;
	// 		else if (cx >= width) cx = width - 1;

	// 		let cy = (points[0][1] + points[1][1] + points[2][1]) / 3;
	// 		if (cy <= 0) cy = 1;
	// 		else if (cy >= height) cy = height - 1;

	// 		// Fetch color at circumcenters
	// 		ctx.fillStyle = getColor(ctx, cx, cy);
	// 		ctx.beginPath();
	// 		ctx.moveTo(points[0][0], points[0][1]);
	// 		ctx.lineTo(points[1][0], points[1][1]);
	// 		ctx.lineTo(points[2][0], points[2][1]);
	// 		ctx.lineTo(points[3][0], points[3][1]);
	// 		ctx.fill();
	// 		ctx.stroke();
	// 	});
	// }
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

function getColor(ctx: CanvasRenderingContext2D, x: number, y: number): string {
	const pixel = ctx.getImageData(x, y, 1, 1).data;
	const color = chroma.rgb(pixel[0], pixel[1], pixel[2]);
	return color.hex();
}
