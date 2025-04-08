// @vitest-environment happy-dom
import Game from "../../src/controllers/game.ts";
import Board from "../../src/modules/board.ts";

describe("board", () => {
	let board: Board;

	beforeEach(() => {
		const element = document.createElement("div");
		const grid = Game.createBoardGrid(6, 7);

		board = new Board(element, grid);
	});

	it("should start with no cells colored", () => {
		expect(board.coloredCoordinates).toEqual([]);
		expect(board.isEveryCellColored()).toBe(false);
	});

	it("should only insert colors to the lowest row in that column", () => {
		board.insertColor("blue", [0, 0]);
		expect(board.coloredCoordinates).toEqual([[5, 0]]);

		board.insertColor("red", [1, 6]);
		expect(board.coloredCoordinates).toEqual([
			[5, 0],
			[5, 6],
		]);

		board.insertColor("blue", [1, 0]);
		expect(board.coloredCoordinates).toEqual([
			[4, 0],
			[5, 0],
			[5, 6],
		]);
	});

	it("should be able to reset all cells", () => {
		board.insertColor("red", [0, 0]);
		board.insertColor("blue", [0, 0]);
		board.reset();

		expect(board.coloredCoordinates).toEqual([]);
		expect(board.isEveryCellColored()).toBe(false);
	});

	it("should return false if nobody is winning", () => {
		board.insertColor("red", [0, 0]);
		board.insertColor("blue", [0, 0]);

		expect(board.isWinner("red")).toBe(false);
		expect(board.isWinner("blue")).toBe(false);
	});

	it("should return an array of coordinates if somebody won", () => {
		for (let i = 0; i < 4; i++) {
			board.insertColor("red", [0, 0]);
		}

		expect(board.isWinner("red")).toBeTruthy();
		expect(board.isWinner("red")).toEqual([
			[2, 0],
			[3, 0],
			[4, 0],
			[5, 0],
		]);
	});

	it("should correctly validate coordinates", () => {
		expect(board.isValidCoordinates([-1, -1])).toBe(false);
		expect(board.isValidCoordinates([100, 100])).toBe(false);

		expect(board.isValidCoordinates([0, 0])).toBe(true);
		expect(board.isValidCoordinates([5, 6])).toBe(true);
	});

	it("should be able to find specific cells based on coordinates", () => {
		board.insertColor("red", [5, 0]);
		const cellOne = board.findCell([5, 0]);
		if (!cellOne) {
			assert.fail("there needs to be a cell.");
		} else {
			expect(cellOne.color).toBe("red");
		}

		board.insertColor("blue", [5, 6]);
		const cellTwo = board.findCell([5, 6]);
		if (!cellTwo) {
			assert.fail("there needs to be a cell.");
		} else {
			expect(cellTwo.color).toBe("blue");
		}
	});

	it("should be able to mark winner cells", () => {
		for (let i = 0; i < 4; i++) {
			board.insertColor("red", [0, 0]);
		}

		const winner = board.isWinner("red");
		if (!winner) {
			assert.fail("there needs to be a winner.");
		} else {
			board.highlightWinnerCells(winner);
		}

		for (let i = 0; i < 4; i++) {
			const cell = board.findCell([5 - i, 0]);
			if (!cell) {
				assert.fail("there needs to be a cell.");
			} else {
				const classList = cell.element.classList;

				expect(Array.from(classList).includes("winner-cell")).toBe(true);
			}
		}
	});
});
