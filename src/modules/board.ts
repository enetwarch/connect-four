import Cell from "./cell.ts";

type Color = "" | "red" | "blue";
type Coordinates = [number, number];
type Direction = (x: number, y: number, i: number) => Coordinates;

export default class Board {
    #element: HTMLDivElement;
    #grid: Cell[][];
    #clickCallback: EventListener;

    constructor(element: HTMLDivElement, grid: Cell[][]) {
        this.#element = element;
        this.#grid = grid;
        this.#clickCallback = () => {};

        this.#grid.flat(1).forEach(cell => {
            this.#element.appendChild(cell.element);
        });
    }

    reset(): void {
        const cells: Cell[] = this.#grid.flat(1);
        cells.forEach(cell => cell.reset());
    }

    isEveryCellColored(): boolean {
        const cells: Cell[] = this.#grid.flat(1);
        return cells.every(cell => cell.color !== "");
    }

    onCellClick(callback: (cell: Cell) => void, cellClassQuery = ".board-cell"): void {
        this.#element.removeEventListener("click", this.#clickCallback);

        this.#clickCallback = event => {
            if (!(event.target instanceof HTMLElement)) return;

            const cellElement = event.target.closest(cellClassQuery);
            if (!(cellElement instanceof HTMLElement)) return;
            if (!cellElement.dataset.coordinates) return;

            const coordinates = JSON.parse(cellElement.dataset.coordinates);
            const cell = this.findCell(coordinates);
            if (!cell || cell.color !== "") return;

            callback(cell);
        }

        this.#element.addEventListener("click", this.#clickCallback);
    }

    findCell(coordinates: Coordinates): Cell | undefined {
        const cells: Cell[] = this.#grid.flat(1);
        const cell = cells.find(cell => {
            return cell.coordinates.every((coord, i) => {
                return coord === coordinates[i];
            });
        });

        return cell;
    }

    isWinner(color: Color): Coordinates[] | false {
        for (const cell of this.#grid.flat(1)) {
            if (cell.color !== color) continue;

            for (const direction of Board.DIRECTIONS) {
                const consecutiveColors = this.getConsecutiveColors(direction, cell);
                if (consecutiveColors.length === 4) return consecutiveColors;
            }
        }

        return false;
    }

    getConsecutiveColors(direction: Direction, cell: Cell): Coordinates[] {
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

    isValidCoordinates(coordinates: Coordinates): boolean {
        const [x, y] = coordinates;
        if (x < 0 || y < 0) return false;
        if (x >= this.#grid.length) return false;
        if (y >= this.#grid[0].length) return false;

        return true;
    }

    highlightWinnerCells(coordinatesList: Coordinates[]): void {
        coordinatesList.forEach(coordinates => {
            const cell = this.findCell(coordinates);
            cell?.highlightAsWinner();
        });
    }

    private static DIRECTIONS: Direction[] = [
        (x, y, i) => [x - i, y],     // North
        (x, y, i) => [x - i, y + i], // Northeast
        (x, y, i) => [x, y + i],     // East
        (x, y, i) => [x + i, y + i], // Southeast
        (x, y, i) => [x + i, y],     // South
        (x, y, i) => [x + i, y - i], // Southwest
        (x, y, i) => [x, y - i],     // West
        (x, y, i) => [x - i, y - i], // Northwest
    ];
}