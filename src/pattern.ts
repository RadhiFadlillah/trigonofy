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
}

export class Pattern {
	width: number;
	height: number;
	points: Point[];
	palette: string[];

	constructor(opts: PatternOptions = {}) {
		opts = validateOptions(opts);
		this.width = opts.width;
		this.height = opts.height;
		this.points = opts.points;
		this.palette = opts.palette;
	}

	renderTriangle({
		lineWidth = 2,
		gradientAngle = undefined,
	} = {}): HTMLCanvasElement {
		// Validate options
		if (!angleValid(gradientAngle)) gradientAngle = randomInt(0, 360);
		gradientAngle = normalizeAngle(gradientAngle);

		// Create canvas
		const [canvas, ctx] = this._prepareCanvas(lineWidth, gradientAngle);

		// Draw background
		ctx.fillRect(0, 0, this.width, this.height);

		// Draw delaunay triangles
		const delaunay = Delaunay.from(this.points);
		[...delaunay.trianglePolygons()].forEach((points) => {
			// Check if this triangle visible
			let visible = points.some((p) => {
				let [x, y] = [p[0], p[1]];
				return x >= 0 && x <= this.width && y >= 0 && y <= this.height;
			});

			// Skip invisible triangles
			if (!visible) return;

			// Calculate centroid
			let cx = (points[0][0] + points[1][0] + points[2][0]) / 3;
			if (cx <= 0) cx = 1;
			else if (cx >= this.width) cx = this.width - 1;

			let cy = (points[0][1] + points[1][1] + points[2][1]) / 3;
			if (cy <= 0) cy = 1;
			else if (cy >= this.height) cy = this.height - 1;

			// Draw triangle
			ctx.fillStyle = getColor(ctx, cx, cy);
			drawPolygon(ctx, points as Point[]);
			if (lineWidth > 0) ctx.stroke();
			ctx.fill();
		});

		return canvas;
	}

	renderVoronoi({
		lineWidth = 2,
		gradientAngle = undefined,
	} = {}): HTMLCanvasElement {
		// Validate options
		if (!angleValid(gradientAngle)) gradientAngle = randomInt(0, 360);
		gradientAngle = normalizeAngle(gradientAngle);

		// Create canvas
		const [canvas, ctx] = this._prepareCanvas(lineWidth, gradientAngle);

		// Draw background
		ctx.fillRect(0, 0, this.width, this.height);

		// Draw voronoi cells
		const delaunay = Delaunay.from(this.points);
		const voronoi = delaunay.voronoi([0, 0, this.width, this.height]);
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

			// Draw cell
			ctx.fillStyle = getColor(ctx, cx, cy);
			drawPolygon(ctx, points as unknown as Point[]);
			if (lineWidth > 0) ctx.stroke();
			ctx.fill();
		});

		return canvas;
	}

	_createGradient(
		ctx: CanvasRenderingContext2D,
		angle: number,
		palette?: string[]
	): CanvasGradient {
		// Prepare variables
		let { width, height } = { ...this };
		if (!paletteValid(palette)) {
			palette = this.palette;
		}

		// Normalize angle
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

	_prepareCanvas(
		lineWidth: number,
		angle: number
	): [HTMLCanvasElement, CanvasRenderingContext2D] {
		// Create canvas
		const canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;

		// Create fill gradient
		const ctx = canvas.getContext('2d');
		const fillGradient = this._createGradient(ctx, angle);

		// Create stroke gradient
		const luminance = chroma.average(this.palette, 'lch').luminance();
		const strokePalette = this.palette.map((hex) => {
			let color = chroma(hex);
			color = luminance >= 0.5 ? color.darken() : color.brighten();
			return color.hex();
		});
		const strokeGradient = this._createGradient(ctx, angle, strokePalette);

		// Set styling
		ctx.lineWidth = lineWidth;
		ctx.fillStyle = fillGradient;
		ctx.strokeStyle = strokeGradient;

		return [canvas, ctx];
	}
}

function validateOptions(opts: PatternOptions = {}): PatternOptions {
	if (typeof opts.width !== 'number') {
		opts.width = 800;
	}

	if (typeof opts.height !== 'number') {
		opts.height = 600;
	}

	if (!pointsValid(opts.points)) {
		opts.points = Points.random(opts.width, opts.height);
	}

	if (!paletteValid(opts.palette)) {
		opts.palette = Palette.random();
	}

	return opts;
}

function pointsValid(points?: any): boolean {
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

function paletteValid(palette?: any): boolean {
	if (!Array.isArray(palette)) return false;
	if (palette.length < 2) return false;

	return palette.every((color) => {
		return typeof color === 'string' && chroma.valid(color);
	});
}

function angleValid(angle?: number): boolean {
	return typeof angle === 'number' && isFinite(angle);
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

function drawPolygon(ctx: CanvasRenderingContext2D, vertices: Point[]) {
	ctx.beginPath();
	ctx.moveTo(vertices[0][0], vertices[0][1]);
	for (let i = 1; i < vertices.length; i++) {
		ctx.lineTo(vertices[i][0], vertices[i][1]);
	}
}
