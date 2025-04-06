import Button from "../modules/button.ts";

export default class UI {
    #resetButton: Button;
    #playButton: Button;
    #userButton: Button;

    constructor() {
        this.#resetButton = UI.createButton("resetButton");
        this.#resetButton.addEventListener("click", this.onResetButtonClick.bind(this));

        this.#playButton = UI.createButton("playButton");
        this.#playButton.addEventListener("click", this.onPlayButtonClick.bind(this));

        this.#userButton = UI.createButton("userButton");
        this.#userButton.addEventListener("click", this.onUserButtonClick.bind(this));
    }

    onResetButtonClick(): void {
        this.#resetButton.toggle();
    }

    onPlayButtonClick(): void {
        this.#playButton.toggle();

        if (this.#playButton.toggled) {
            this.#playButton.changeIcon("fa-pause");
        } else {
            this.#playButton.changeIcon("fa-play");
        }
    }

    onUserButtonClick(): void {
        this.#userButton.toggle();
    }

    static getElementById(id: string): HTMLElement {
        const element = document.getElementById(id);
        if (!element) {
            throw Error(`No element found with "#${id}" id.`);
        }

        return element;
    }

    static createButton(id: string): Button {
        const element = UI.getElementById(id);
        if (!(element instanceof HTMLButtonElement)) {
            throw Error(`The element with id "#${id}" is not a button.`);
        }

        return new Button(element);
    }
}