import chroma from 'chroma-js';
import { Delaunay } from 'd3-delaunay';

import { Palette } from './palette';
import { Point, GridPoints, UniformPoints, generatePoints } from './points';
import {
	randomInt,
	drawPolygon,
	createGradient,
	getCanvasColor,
} from './utils';

export interface TriangleOptions {
	width: number;
	height: number;
	palette?: string[];
	points?: UniformPoints | GridPoints;

	lineOnly?: boolean;
	lineWidth?: number;
	gradientAngle?: number;
}

export type VoronoiOptions = TriangleOptions;

export function Triangle(ctx: CanvasRenderingContext2D, opts: TriangleOptions) {
	triangle(ctx, opts, false);
}

export function Voronoi(ctx: CanvasRenderingContext2D, opts: VoronoiOptions) {
	triangle(ctx, opts, true);
}

function triangle(
	ctx: CanvasRenderingContext2D,
	opts: TriangleOptions,
	voronoi: boolean
) {
	// Prepare palette
	if (!Palette.isValid(opts.palette)) {
		opts.palette = Palette.random();
	}

	// Prepare angle
	let angle = opts.gradientAngle;
	if (typeof angle !== 'number' || !isFinite(angle)) {
		angle = randomInt(0, 360);
	}

	if (angle < 0) {
		while (angle < 0) angle += 360;
	} else if (angle > 360) {
		while (angle > 360) angle -= 360;
	}

	// Generate gradient
	const { width, height, palette } = { ...opts };
	const gradient = createGradient(ctx, width, height, palette, angle);

	// Generate polygons
	const vertices = generatePoints(width, height, opts.points);
	const delaunay = Delaunay.from(vertices);

	let polygons: Point[][];
	if (!voronoi) {
		polygons = [...delaunay.trianglePolygons()] as unknown as Point[][];
	} else {
		const voronoi = delaunay.voronoi([0, 0, width, height]);
		polygons = [...voronoi.cellPolygons()] as unknown as Point[][];
	}

	// Only use visible polygon
	polygons = polygons.filter((polygon) => {
		return polygon.some((p) => {
			let [x, y] = [p[0], p[1]];
			return x >= 0 && x <= width && y >= 0 && y <= height;
		});
	});

	// Set context styling
	ctx.lineWidth = opts.lineWidth || 0;
	ctx.fillStyle = gradient;
	ctx.strokeStyle = gradient;

	// Handle the filled cells
	if (opts.lineOnly !== true) {
		// Generate line gradient if necessary
		if (ctx.lineWidth > 0) {
			const mapper =
				Palette.luminance(palette) >= 0.5
					? (hex: string) => chroma(hex).darken().hex()
					: (hex: string) => chroma(hex).brighten().hex();
			const lPalette = palette.map(mapper);
			const lineGradient = createGradient(ctx, width, height, lPalette, angle);
			ctx.strokeStyle = lineGradient;
		}

		// Draw base background
		ctx.fillRect(0, 0, width, height);

		// Fill polygons
		polygons.forEach((polygon) => {
			// Calculate centroid
			let cx = (polygon[0][0] + polygon[1][0] + polygon[2][0]) / 3;
			if (cx <= 0) cx = 1;
			else if (cx >= width) cx = width - 1;

			let cy = (polygon[0][1] + polygon[1][1] + polygon[2][1]) / 3;
			if (cy <= 0) cy = 1;
			else if (cy >= height) cy = height - 1;

			// Fill polygon
			ctx.beginPath();
			ctx.fillStyle = getCanvasColor(ctx, cx, cy).hex();
			drawPolygon(ctx, polygon);
			ctx.fill();
		});
	}

	// Finally, draw polygon borders
	if (ctx.lineWidth > 0) {
		ctx.beginPath();
		polygons.forEach((polygon) => drawPolygon(ctx, polygon));
		ctx.stroke();
	}
}
