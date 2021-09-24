import chroma from 'chroma-js';
import { randomInt } from './utils';

export enum PaletteType {
	Chaos,
	Complementary,
	Monochromatic,
	Analogous,
	Triadic,
	Tetradic,
}

export function generatePalette(
	base: chroma.Color,
	type: PaletteType
): string[] {
	switch (type) {
		case PaletteType.Complementary:
			return complementaryPalette(base);
		case PaletteType.Monochromatic:
			return monochromaticPalette(base);
		case PaletteType.Analogous:
			return analogousPalette(base);
		case PaletteType.Triadic:
			return triadicPalette(base);
		case PaletteType.Tetradic:
			return tetradicPalette(base);
		default:
			return chaosPalette(base);
	}
}

function chaosPalette(base: chroma.Color): string[] {
	let paletteSize = randomInt(4, 10);

	let nBase = randomInt(2, paletteSize / 2);
	let baseColors = [base];
	for (let i = 1; i < nBase; i++) {
		baseColors.push(chroma.random());
	}

	return chroma.scale(baseColors).mode('lch').colors(paletteSize);
}

function complementaryPalette(base: chroma.Color): string[] {
	let [h, s, l] = base.hsl();
	let accent = chroma.hsl(h - 180, s, l);
	let paletteSize = randomInt(4, 10);
	return chroma.scale([base, accent]).mode('lch').colors(paletteSize);
}

function monochromaticPalette(base: chroma.Color): string[] {
	let [h, s, _] = base.hsl();
	let paletteSize = randomInt(4, 10);
	let lStep = 1 / (paletteSize + 1);

	let palette: string[] = [];
	for (let i = paletteSize; i >= 1; i--) {
		palette.push(chroma.hsl(h, s, i * lStep).hex());
	}

	return palette;
}

function analogousPalette(base: chroma.Color): string[] {
	let [h, s, l] = base.hsl();
	let accent1 = chroma.hsl(h + 30, s, l);
	let accent2 = chroma.hsl(h + 60, s, l);

	let paletteSize = randomInt(4, 10);
	return chroma.scale([base, accent1, accent2]).mode('lch').colors(paletteSize);
}

function triadicPalette(base: chroma.Color): string[] {
	let [h, s, l] = base.hsl();
	let accent1 = chroma.hsl(h + 120, s, l);
	let accent2 = chroma.hsl(h + 240, s, l);

	let paletteSize = randomInt(4, 10);
	return chroma.scale([base, accent1, accent2]).mode('lch').colors(paletteSize);
}

function tetradicPalette(base: chroma.Color): string[] {
	let [h, s, l] = base.hsl();
	let accent1 = chroma.hsl(h + 90, s, l);
	let accent2 = chroma.hsl(h + 180, s, l);
	let accent3 = chroma.hsl(h + 270, s, l);

	let paletteSize = randomInt(4, 10);
	return chroma
		.scale([base, accent1, accent2, accent3])
		.mode('lch')
		.colors(paletteSize);
}
