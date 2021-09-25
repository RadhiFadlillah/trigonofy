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
		const nSources = randomInt(2, paletteSize / 2);
		for (let i = 1; i < nSources; i++) {
			sources.push(chroma.random());
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
}

function parseColor(color?: string): chroma.Color {
	if (chroma.valid(color)) {
		return chroma(color);
	} else {
		return chroma.random();
	}
}
