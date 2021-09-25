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

		// Generate pattern
		const delaunay = Delaunay.from(points);
		const voronoi = delaunay.voronoi([0, 0, width, height]);

		// Draw pattern
		const canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;
		document.body.appendChild(canvas);

		const ctx = canvas.getContext('2d');
		ctx.lineWidth = 1;

		ctx.beginPath();
		ctx.strokeStyle = 'red';
		delaunay.render(ctx);
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = 'blue';
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
	if (palette.length === 0) return false;

	return palette.every((color) => {
		return typeof color === 'string' && chroma.valid(color);
	});
}
