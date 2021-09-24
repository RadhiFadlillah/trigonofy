// Imports
import chroma from 'chroma-js';
import { randomEnum } from './utils';
import { generatePalette, PaletteType } from './palette';

// Types
export interface Options {
	width?: number;
	height?: number;
	triangleHeight?: number;
	variance?: number;
	baseColor?: string;
	paletteType?: PaletteType;
}

// Enums
export enum GradientType {
	Linear,
	Radial,
}

// Main class
export class Pattern {
	width: number;
	height: number;
	triangleHeight: number;
	triangleVariance: number;
	baseColor: chroma.Color;
	palette: string[];

	constructor(
		opts: Options = {
			width: 800,
			height: 600,
			triangleHeight: 75,
			variance: 0.75,
		}
	) {
		// Set default value
		this.width = opts.width || 800;
		this.height = opts.height || 600;
		this.triangleHeight = opts.triangleHeight || 75;
		this.triangleVariance = opts.variance || 0.75;
		this.baseColor = chroma.valid(opts.baseColor)
			? chroma(opts.baseColor)
			: chroma.random();

		// Generate palette
		let paletteType =
			opts.paletteType in PaletteType
				? opts.paletteType
				: randomEnum(PaletteType);

		this.palette = generatePalette(this.baseColor, paletteType);

		console.log(this.palette);

		this.palette.forEach((hex) => {
			let div = document.createElement('div');
			div.style.backgroundColor = hex;
			div.style.width = '100px';
			div.style.height = '100px';
			document.body.appendChild(div);
		});
	}
}
