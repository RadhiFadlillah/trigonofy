export function randomInt(min: number, max: number): number {
	if (min < 0) min = 0;
	if (max < 0) max = 0;
	if (min > max) [min, max] = [max, min];

	let delta = max - min;
	let random = Math.floor(Math.random() * (delta + 1));
	return min + random;
}
