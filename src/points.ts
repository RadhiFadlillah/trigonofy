import { randomInt } from './utils';

export type Point = [number, number];

export class Points {
	static random(width: number, height: number, cellSize?: number): Point[] {
		let d2 = randomInt(1, 2);
		switch (d2) {
			case 1:
				return this.uniform(width, height, cellSize);
			case 2:
			default:
				return this.grid(width, height, cellSize);
		}
	}

	static uniform(width: number, height: number, cellSize?: number): Point[] {
		if (width < 0) width = 0;
		if (height < 0) height = 0;
		if (cellSize == null || cellSize <= 0) {
			cellSize = randomCellSize(width, height);
		}

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

	static grid(
		width: number,
		height: number,
		cellSize?: number,
		variance?: number
	): Point[] {
		if (width < 0) width = 0;
		if (height < 0) height = 0;

		if (variance < 0) variance = 0;
		else if (variance > 1) variance = 1;
		else if (variance == null) variance = Math.random();

		if (cellSize == null || cellSize <= 0) {
			cellSize = randomCellSize(width, height);
		}

		const [minX, maxX] = [-width / 2, width * 1.5];
		const [minY, maxY] = [-height / 2, height * 1.5];
		const delta = (): number => {
			let coin = Math.round(Math.random());
			let delta = Math.round(Math.random() * cellSize * variance);
			return coin === 1 ? delta : -delta;
		};

		const points: [number, number][] = [];
		for (let x = minX; x <= maxX; x += cellSize) {
			for (let y = minY; y <= maxY; y += cellSize) {
				points.push([x + delta(), y + delta()]);
			}
		}

		return points;
	}
}

function randomCellSize(width: number, height: number): number {
	const limit = Math.min(width, height);
	let minSize = Math.min(limit, 20);
	let maxSize = Math.floor(limit / 5);
	return randomInt(minSize, maxSize);
}
