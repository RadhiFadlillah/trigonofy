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

		const padding = Math.max(Math.min(width, height) / 2, cellSize);
		const totalWidth = width + 2 * padding;
		const totalHeight = height + 2 * padding;

		const nRow = Math.ceil(totalHeight / cellSize);
		const nColumn = Math.ceil(totalWidth / cellSize);
		const nPoint = nRow * nColumn;

		const points: [number, number][] = [];
		for (let i = 0; i < nPoint; i++) {
			let x = Math.round(Math.random() * totalWidth - padding);
			let y = Math.round(Math.random() * totalHeight - padding);
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

		const padding = Math.max(Math.min(width, height) / 2, cellSize);
		const [minX, maxX] = [-padding, width + padding];
		const [minY, maxY] = [-padding, height + padding];
		const delta = (): number => {
			let d1 = Math.round(Math.random());
			let delta = Math.round(Math.random() * cellSize * variance);
			return d1 === 1 ? delta : -delta;
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
	let minSize = Math.min(limit, 50);
	let maxSize = Math.floor(limit / 5);
	return randomInt(minSize, maxSize);
}
