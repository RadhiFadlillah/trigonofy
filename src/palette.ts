import chroma from 'chroma-js';
import { randomInt } from './utils';

export class Palette {
	static random(baseColor?: string): string[] {
		let d7 = randomInt(1, 7);
		switch (d7) {
			case 1:
				return this.chaos(baseColor);
			case 2:
				return this.complementary(baseColor);
			case 3:
				return this.monochromatic(baseColor);
			case 4:
				return this.analogous(baseColor);
			case 5:
				return this.triadic(baseColor);
			case 6:
				return this.tetradic(baseColor);
			case 7:
			default:
				return this.colorbrewer();
		}
	}

	static chaos(baseColor?: string): string[] {
		const base = parseColor(baseColor);

		const sources = [base];
		const paletteSize = randomInt(4, 10);
		for (let i = 1; i < 4; i++) {
			sources.push(relativeRandom(sources[i - 1]));
		}

		return chroma.scale(sources).mode('lch').colors(paletteSize);
	}

	static complementary(baseColor?: string): string[] {
		const base = parseColor(baseColor);

		const [h, s, l] = base.hsl();
		const accent = chroma.hsl(h - 180, s, l);

		const paletteSize = randomInt(4, 10);
		return chroma.scale([base, accent]).mode('lch').colors(paletteSize);
	}

	static monochromatic(baseColor?: string): string[] {
		const base = parseColor(baseColor);

		const [h, s, _] = base.hsl();
		const paletteSize = randomInt(4, 10);
		const lStep = 1 / (paletteSize + 1);

		const palette: string[] = [];
		for (let i = paletteSize; i >= 1; i--) {
			palette.push(chroma.hsl(h, s, i * lStep).hex());
		}

		return palette;
	}

	static analogous(baseColor?: string): string[] {
		const base = parseColor(baseColor);

		const [h, s, l] = base.hsl();
		const accent1 = chroma.hsl(h + 30, s, l);
		const accent2 = chroma.hsl(h + 60, s, l);

		const paletteSize = randomInt(4, 10);
		return chroma
			.scale([base, accent1, accent2])
			.mode('lch')
			.colors(paletteSize);
	}

	static triadic(baseColor?: string): string[] {
		const base = parseColor(baseColor);

		const [h, s, l] = base.hsl();
		const accent1 = chroma.hsl(h + 120, s, l);
		const accent2 = chroma.hsl(h + 240, s, l);

		const paletteSize = randomInt(4, 10);
		return chroma
			.scale([base, accent1, accent2])
			.mode('lch')
			.colors(paletteSize);
	}

	static tetradic(baseColor?: string): string[] {
		const base = parseColor(baseColor);

		const [h, s, l] = base.hsl();
		const accent1 = chroma.hsl(h + 90, s, l);
		const accent2 = chroma.hsl(h + 180, s, l);
		const accent3 = chroma.hsl(h + 270, s, l);

		const paletteSize = randomInt(4, 10);
		return chroma
			.scale([base, accent1, accent2, accent3])
			.mode('lch')
			.colors(paletteSize);
	}

	static colorbrewer(key?: string): string[] {
		const cbKeys = Object.keys(chroma.brewer);

		if (key != null && key in cbKeys) {
			return chroma.brewer[key];
		} else {
			const idx = Math.floor(Math.random() * cbKeys.length);
			return chroma.brewer[cbKeys[idx]];
		}
	}

	static isValid(colors?: string[]): boolean {
		if (!Array.isArray(colors)) return false;
		if (colors.length < 2) return false;

		return colors.every((color) => {
			return typeof color === 'string' && chroma.valid(color);
		});
	}

	static luminance(colors: string[]): number {
		return chroma.average(colors, 'lch').luminance();
	}
}

function parseColor(color?: string): chroma.Color {
	if (chroma.valid(color)) {
		return chroma(color);
	} else {
		return chroma.random();
	}
}

function relativeRandom(base?: chroma.Color): chroma.Color {
	if (base == null) {
		return chroma.random();
	}

	let d3 = randomInt(1, 3);
	let [h, s, l] = base.hsl();
	switch (d3) {
		case 1:
			h = randomInt(1, 360);
		case 2:
			s = Math.random();
		case 3:
		default:
			l = Math.random();
	}

	return chroma.hsl(h, s, l);
}
