// Imports
import chroma from 'chroma-js';
import { Delaunay } from 'd3-delaunay';
import { randomEnum } from './utils';
import { generatePalette, PaletteType } from './palette';
import { generatePoints, DistributionType } from './points';

// Types
export interface Options {
	width?: number;
	height?: number;
	cellSize?: number;
	baseColor?: string;
	paletteType?: PaletteType;
	pointDistribution?: DistributionType;
}

// Enums
export { PaletteType, DistributionType };
export enum GradientType {
	Linear,
	Radial,
}

// Main class
export class Pattern {
	width: number;
	height: number;
	cellSize: number;
	palette: string[];
	points: [number, number][];

	constructor(
		opts: Options = {
			width: 800,
			height: 600,
			cellSize: 75,
		}
	) {
		// Set default value
		this.width = opts.width || 800;
		this.height = opts.height || 600;
		this.cellSize = opts.cellSize || 75;

		// Generate palette
		const baseColor = chroma.valid(opts.baseColor)
			? chroma(opts.baseColor)
			: chroma.random();

		const paletteType =
			opts.paletteType in PaletteType
				? opts.paletteType
				: randomEnum(PaletteType);

		this.palette = generatePalette(baseColor, paletteType);

		// Generate points
		const distributionType =
			opts.pointDistribution in DistributionType
				? opts.pointDistribution
				: randomEnum(DistributionType);

		this.points = generatePoints(
			this.width,
			this.height,
			this.cellSize,
			distributionType
		);

		// Draw
		const canvas = document.createElement('canvas');
		canvas.width = this.width;
		canvas.height = this.height;
		document.body.appendChild(canvas);

		const ctx = canvas.getContext('2d');
		ctx.lineWidth = 1;

		const delaunay = Delaunay.from(this.points);
		const voronoi = delaunay.voronoi([0, 0, this.width, this.height]);

		ctx.beginPath();
		ctx.strokeStyle = 'red';
		delaunay.render(ctx);
		ctx.stroke();

		ctx.beginPath();
		ctx.strokeStyle = 'blue';
		voronoi.render(ctx);
		ctx.stroke();

		// this.palette.forEach((hex) => {
		// 	let div = document.createElement('div');
		// 	div.style.backgroundColor = hex;
		// 	div.style.width = '100px';
		// 	div.style.height = '100px';
		// 	document.body.appendChild(div);
		// });
	}
}
