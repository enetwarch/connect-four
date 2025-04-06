type Color = "" | "red" | "blue";

export default class Player {
    #name: string;
    #color: Color;
    #number: number;

    #turn: boolean;
    #winner: boolean;

    public constructor(name: string, color: Color, number: number) {
        this.#name = name === "" ? `Player ${number}` : name;
        this.#color = color;
        this.#number = number;

        this.#turn = false;
        this.#winner = false;
    }

    public get name(): string {
        return this.#name;
    }

    public get color(): Color {
        return this.#color;
    }

    public get number(): number {
        return this.#number;
    }

    public get turn(): boolean {
        return this.#turn;
    }

    public get winner(): boolean {
        return this.#winner;
    }

    public set name(value: string) {
        if (value === "") {
            value = `Player ${this.number}`;
        }

        this.#name = value;
    }

    public set color(value: Color) {
        this.#color = value;
    }

    public set number(value: number) {
        this.#number = value
    }

    public set turn(value: boolean) {
        this.#turn = value;
    }

    public set winner(value: boolean) {
        this.#winner = value;
    }

    public isDefaultName(): boolean {
        return this.#name === `Player ${this.#number}`;
    }
}