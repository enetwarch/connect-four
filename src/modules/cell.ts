type Color = "" | "red" | "blue";
type Coordinates = [number, number];

export default class Cell {
    #element: HTMLButtonElement;
    #color: Color;

    constructor(coordinates: Coordinates, elementClass = "board-cell") {      
        this.#element = document.createElement("button");
        this.#element.classList.add(elementClass);
        this.#element.type = "button";
        this.#element.dataset.coordinates = JSON.stringify(coordinates);

        this.#color = "";
    }

    get element(): HTMLButtonElement {
        return this.#element;
    }

    get coordinates(): Coordinates {
        const coordinates = this.#element.dataset.coordinates;
        if (!coordinates) {
            throw Error(`No coordinates in ${this.#element} dataset.`);
        }

        return JSON.parse(coordinates);
    }

    get color(): Color {
        return this.#color;
    }

    set color(value: Color) {
        this.#color = value;

        const cellClassList = Cell.getCellClassList(value);
        this.#element.classList.add(...cellClassList);
    }

    reset(elementClass = "board-cell"): void {
        if (this.#color === "") return;
        this.#color = "";

        this.#element.classList.value = elementClass;
    }

    highlightAsWinner(winnerClass = "winner-cell"): void {
        this.#element.classList.add(winnerClass);
    }

    private static getCellClassList(color: Color): string[] {
        switch (color) {
            case "red": return ["red-cell"];
            case "blue": return ["blue-cell"];
            case "": return [];

            default: throw Error(`No cell classlist for "${color}".`);
        }
    }
}