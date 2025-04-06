import Button from "../modules/button.ts";
import Modal from "../modules/modal.ts";

export default class UI {
    #resetButton: Button;
    #resetModal: Modal;
    #noResetButton: Button;
    #yesResetButton: Button;
    #playButton: Button;
    #userButton: Button;
    #playerModal: Modal;

    constructor() {
        this.#resetButton = UI.createButton("resetButton");
        this.#resetButton.addEventListener("toggle", this.onResetButtonToggle.bind(this));
        this.#resetButton.addEventListener("click", this.onResetButtonClick.bind(this));

        this.#resetModal = UI.createModal("resetModal");
        this.#resetModal.addEventListener("close", this.onResetModalClose.bind(this));

        this.#noResetButton = UI.createButton("noResetButton");
        this.#noResetButton.addEventListener("click", this.onNoResetButtonClick.bind(this));

        this.#yesResetButton = UI.createButton("yesResetButton");
        this.#yesResetButton.addEventListener("click", this.onYesResetButtonClick.bind(this));

        this.#playButton = UI.createButton("playButton");
        this.#playButton.addEventListener("toggle", this.onPlayButtonToggle.bind(this));
        this.#playButton.addEventListener("click", this.onPlayButtonClick.bind(this));

        this.#userButton = UI.createButton("userButton");
        this.#userButton.addEventListener("toggle", this.onUserButtonToggle.bind(this));
        this.#userButton.addEventListener("click", this.onUserButtonClick.bind(this));

        this.#playerModal = UI.createModal("playerModal");
        this.#playerModal.addEventListener("close", this.onPlayerModalClose.bind(this));

        this.#playButton.click();
    }

    private onResetButtonToggle(): void {
        if (this.#resetButton.toggled) {
            this.#resetModal.show();

            if (this.#playButton.toggled) {
                this.#playButton.click();
            }
        } else {
            this.#resetModal.close();

            if (!this.#playButton.toggled) {
                this.#playButton.click();
            }
        }
    }

    private onResetButtonClick(): void {
        this.#resetButton.toggle();
    }

    private onResetModalClose(): void {
        if (this.#resetButton.toggled) {
            this.#resetButton.click();
        }
    }

    private onNoResetButtonClick(): void {
        this.#resetModal.close();
    }

    private onYesResetButtonClick(): void {
        document.dispatchEvent(new Event("gamereset"));
        this.#resetModal.close();
    }
    
    private onPlayButtonToggle(): void {
        if (this.#playButton.toggled) {
            document.dispatchEvent(new Event("gameresume"));
            this.#playButton.changeIcon("fa-pause");
        } else {
            document.dispatchEvent(new Event("gamepause"));
            this.#playButton.changeIcon("fa-play");
        }
    }

    private onPlayButtonClick(): void {
        this.#playButton.toggle();
    }

    private onUserButtonToggle(): void {
        if (this.#userButton.toggled) {
            this.#playerModal.show();

            if (this.#playButton.toggled) {
                this.#playButton.click();
            }
        } else {
            this.#playerModal.close();

            if (!this.#playButton.toggled) {
                this.#playButton.click();
            }
        }
    }

    private onUserButtonClick(): void {
        this.#userButton.toggle();
    }

    private onPlayerModalClose(): void {
        if (this.#userButton.toggled) {
            this.#userButton.click();
        }
    }

    private static getElementById(id: string): HTMLElement {
        const element = document.getElementById(id);
        if (!element) {
            throw Error(`No element found with "#${id}" id.`);
        }

        return element;
    }

    private static querySelector(parent: HTMLElement, query: string): HTMLElement {
        const element = parent.querySelector(query);
        if (!element || !(element instanceof HTMLElement)) {
            throw Error(`No element found with "${query}" query.`);
        }

        return element;
    }

    private static createButton(id: string): Button {
        const element = UI.getElementById(id);
        if (!(element instanceof HTMLButtonElement)) {
            throw Error(`The element with id "#${id}" is not a button.`);
        }

        return new Button(element);
    }

    private static createModal(id: string, closeButtonQuery: string = ".modal-close-button"): Modal {
        const element = UI.getElementById(id);
        if (!(element instanceof HTMLDialogElement)) {
            throw Error(`The element with id "#${id}" is not a modal.`);
        }

        const closeButton = UI.querySelector(element, closeButtonQuery);
        if (!(closeButton instanceof HTMLButtonElement)) {
            throw Error(`"${closeButtonQuery}" query is not a button.`);
        }

        return new Modal(element, closeButton);
    }
}