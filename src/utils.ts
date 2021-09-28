import chroma from 'chroma-js';
import { Point } from './points';

export function randomEnum(enumeration: Record<string, any>): number {
	const values = Object.values(enumeration).filter((val) => isFinite(val));
	const idx = Math.floor(Math.random() * values.length);
	return values[idx];
}

export function randomInt(min: number, max: number): number {
	if (min < 0) min = 0;
	if (max < 0) max = 0;
	if (min > max) [min, max] = [max, min];

	let delta = max - min;
	let random = Math.floor(Math.random() * (delta + 1));
	return min + random;
}

export function createGradient(
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number,
	palette: string[],
	angle: number
): CanvasGradient {
	// Calculate gradient endpoints
	let [x0, y0] = [width / 2, 0];
	let [x1, y1] = [width / 2, height];
	if (Math.abs(angle) !== 90) {
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

export function getCanvasColor(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number
): chroma.Color {
	const pixel = ctx.getImageData(x, y, 1, 1).data;
	const color = chroma.rgb(pixel[0], pixel[1], pixel[2]);
	return color;
}

export function drawPolygon(ctx: CanvasRenderingContext2D, vertices: Point[]) {
	ctx.moveTo(vertices[0][0], vertices[0][1]);
	for (let i = 1; i < vertices.length; i++) {
		ctx.lineTo(vertices[i][0], vertices[i][1]);
	}
}
