// @vitest-environment happy-dom
import Cell from "../../src/modules/cell.ts";

describe("cell", () => {
	let cell: Cell;

	beforeEach(() => {
		cell = new Cell([0, 0]);
	});

	it("should have a button as its element variable", () => {
		expect(cell.element).toBeInstanceOf(HTMLButtonElement);
	});

	it("should return coordinates as [number, number] type", () => {
		expectTypeOf(cell.coordinates).toEqualTypeOf<[number, number]>();
	});

	it("should return correct coordinates", () => {
		expect(cell.coordinates).toEqual([0, 0]);
	});

	it("should start with no color", () => {
		expect(cell.color).toBe("");
	});

	it("should be able to change color to red", () => {
		cell.color = "red";
		const classList = cell.element.classList;

		expect(cell.color).toBe("red");
		expect(Array.from(classList).includes("red-cell")).toBe(true);
	});

	it("should be able to change color to blue", () => {
		cell.color = "blue";
		const classList = cell.element.classList;

		expect(cell.color).toBe("blue");
		expect(Array.from(classList).includes("blue-cell")).toBe(true);
	});

	it("should be able to reset its color", () => {
		cell.color = "red";
		cell.reset();
		const classList = cell.element.classList;

		expect(cell.color).toBe("");
		expect(classList.value).toBe("board-cell");
	});

	it("should have winner-cell class when highlighted as winner", () => {
		cell.color = "blue";
		cell.highlightAsWinner();

		const classList = cell.element.classList;
		expect(Array.from(classList).includes("winner-cell")).toBe(true);
	});
});
