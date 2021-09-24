import { randomInt } from './utils';

export enum DistributionType {
	Uniform,
	Grid,
	Gaussian,
	Degenerate,
}

export function generatePoints(
	width: number,
	height: number,
	cellSize: number,
	type: DistributionType
): [number, number][] {
	switch (type) {
		case DistributionType.Grid:
			return gridPoints(width, height, cellSize);
		default:
			return uniformPoints(width, height, cellSize);
	}
}

function uniformPoints(
	width: number,
	height: number,
	cellSize: number
): [number, number][] {
	const nRow = Math.ceil(width / cellSize) * 2;
	const nColumn = Math.ceil(height / cellSize) * 2;
	const nPoint = nRow * nColumn;

	const points: [number, number][] = [];
	for (let i = 0; i < nPoint; i++) {
		let x = Math.round(Math.random() * (width * 2) - width / 2);
		let y = Math.round(Math.random() * (height * 2) - height / 2);
		points.push([x, y]);
	}

	return points;
}

function gridPoints(
	width: number,
	height: number,
	cellSize: number
): [number, number][] {
	const [minX, maxX] = [-width / 2, width * 1.5];
	const [minY, maxY] = [-height / 2, height * 1.5];
	const delta = () => cellSizeDelta(cellSize);

	const points: [number, number][] = [];
	for (let x = minX; x <= maxX; x += cellSize) {
		for (let y = minY; y <= maxY; y += cellSize) {
			points.push([x + delta(), y + delta()]);
		}
	}

	console.log(points);

	return points;
}

function cellSizeDelta(cellSize: number): number {
	let coin = Math.round(Math.random());
	let delta = Math.round(Math.random() * cellSize * 0.2);
	return coin === 1 ? delta : -delta;
}
