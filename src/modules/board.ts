import type Cell from "./cell.ts";

type Color = "" | "red" | "blue";
type Coordinates = [number, number];
type Direction = (x: number, y: number, i: number) => Coordinates;

export default class Board {
	#element: HTMLDivElement;
	#grid: Cell[][];
	#clickCallback: EventListener;

	public constructor(element: HTMLDivElement, grid: Cell[][]) {
		this.#element = element;
		this.#grid = grid;
		this.#clickCallback = () => {};

		for (const cell of this.#grid.flat(1)) {
			this.#element.appendChild(cell.element);
		}
	}

	public get size(): Coordinates {
		return [this.#grid.length, this.#grid[0].length];
	}

	public get coloredCoordinates(): Coordinates[] {
		const coordinates: Coordinates[] = [];

		for (const cell of this.#grid.flat(1)) {
			if (cell.color !== "") {
				coordinates.push(cell.coordinates);
			}
		}

		return coordinates;
	}

	public reset(): void {
		const cells: Cell[] = this.#grid.flat(1);
		for (const cell of cells) {
			cell.reset();
		}
	}

	public isEveryCellColored(): boolean {
		const cells: Cell[] = this.#grid.flat(1);
		return cells.every((cell) => cell.color !== "");
	}

	public onCellClick(
		callback: (cell: Cell) => void,
		cellClassQuery = ".board-cell",
	): void {
		this.#element.removeEventListener("click", this.#clickCallback);

		this.#clickCallback = (event) => {
			if (!(event.target instanceof HTMLElement)) return;

			const cellElement = event.target.closest(cellClassQuery);
			if (!(cellElement instanceof HTMLElement)) return;
			if (!cellElement.dataset.coordinates) return;

			const coordinates = JSON.parse(cellElement.dataset.coordinates);
			const cell = this.findCell(coordinates);
			if (!cell || cell.color !== "") return;

			callback(cell);
		};

		this.#element.addEventListener("click", this.#clickCallback);
	}

	public insertColor(color: Color, coordinates: Coordinates): void {
		const [x, y] = coordinates;

		for (let i = this.#grid.length - 1; i >= 0; i--) {
			const cell = this.#grid[i][y];
			if (x === i && cell.color !== "") return;
			if (cell.color !== "") continue;

			cell.color = color;
			return;
		}
	}

	public isWinner(color: Color): Coordinates[] | false {
		for (const cell of this.#grid.flat(1)) {
			if (cell.color !== color) continue;

			for (const direction of Board.DIRECTIONS) {
				const consecutiveColors = this.getConsecutiveColors(direction, cell);
				if (consecutiveColors.length === 4) return consecutiveColors;
			}
		}

		return false;
	}

	public findCell(coordinates: Coordinates): Cell | undefined {
		const cells: Cell[] = this.#grid.flat(1);
		const cell = cells.find((cell) => {
			return cell.coordinates.every((coord, i) => {
				return coord === coordinates[i];
			});
		});

		return cell;
	}

	public highlightWinnerCells(coordinatesList: Coordinates[]): void {
		for (const coordinates of coordinatesList) {
			const cell = this.findCell(coordinates);
			cell?.highlightAsWinner();
		}
	}

	public isValidCoordinates(coordinates: Coordinates): boolean {
		const [x, y] = coordinates;
		if (x < 0 || y < 0) return false;
		if (x >= this.#grid.length) return false;
		if (y >= this.#grid[0].length) return false;

		return true;
	}

	private getConsecutiveColors(
		direction: Direction,
		cell: Cell,
	): Coordinates[] {
		const [x, y] = cell.coordinates;
		const consecutiveMarks: Coordinates[] = [];

		for (let i = 0; i < 4; i++) {
			const [dx, dy] = direction(x, y, i);
			if (!this.isValidCoordinates([dx, dy])) return consecutiveMarks;

			const dcell = this.#grid[dx][dy];
			if (dcell.color !== cell.color) return consecutiveMarks;

			consecutiveMarks.push([dx, dy]);
		}

		return consecutiveMarks;
	}

	private static DIRECTIONS: Direction[] = [
		(x, y, i) => [x - i, y], // North
		(x, y, i) => [x - i, y + i], // Northeast
		(x, y, i) => [x, y + i], // East
		(x, y, i) => [x + i, y + i], // Southeast
		(x, y, i) => [x + i, y], // South
		(x, y, i) => [x + i, y - i], // Southwest
		(x, y, i) => [x, y - i], // West
		(x, y, i) => [x - i, y - i], // Northwest
	];
}
