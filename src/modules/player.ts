type Color = "" | "red" | "blue";

export default class Player {
    #name: string;
    #color: Color;
    #number: number;

    #turn: boolean;
    #winner: boolean;

    constructor(name: string, color: Color, number: number) {
        this.#name = name;
        this.#color = color;
        this.#number = number;

        this.#turn = false;
        this.#winner = false;
    }

    get name(): string {
        return this.#name;
    }

    get color(): Color {
        return this.#color;
    }

    get number(): number {
        return this.#number;
    }

    get turn(): boolean {
        return this.#turn;
    }

    get winner(): boolean {
        return this.#winner;
    }

    set name(value: string) {
        if (value === "") {
            value = `Player ${this.number}`;
        }

        this.#name = value;
    }

    set color(value: Color) {
        this.#color = value;
    }

    set number(value: number) {
        this.#number = value
    }

    set turn(value: boolean) {
        this.#turn = value;
    }

    set winner(value: boolean) {
        this.#winner = value;
    }
}