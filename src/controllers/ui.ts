import Observable from "./observable.ts";
import Player from "../modules/player.ts";
import Button from "../modules/button.ts";
import Modal from "../modules/modal.ts";
import Form from "../modules/form.ts";

export default class UI {
    #observable: Observable;
    #players: Player[];

    #resetButton: Button;
    #noResetButton: Button;
    #yesResetButton: Button;
    #playButton: Button;
    #userButton: Button;
    #okWinnerButton: Button;

    #resetModal: Modal;
    #playerModal: Modal;
    #winnerModal: Modal;

    #playerForm: Form;

    public constructor(observable: Observable) {
        this.#observable = observable;
        this.#players = this.#observable.players;
        this.#observable.subscribe(this.setPlayers.bind(this));

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

        this.#playerForm = UI.createForm("playerForm");
        this.#playerForm.onSubmit(this.onPlayerFormSubmit.bind(this));

        this.#winnerModal = UI.createModal("winnerModal");
        this.#winnerModal.addEventListener("close", this.onWinnerModalClose.bind(this));
        document.addEventListener("gameover", this.onGameover.bind(this));

        this.#okWinnerButton = UI.createButton("okWinnerButton");
        this.#okWinnerButton.addEventListener("click", this.onOkWinnerButtonClick.bind(this));

        document.addEventListener("contextmenu", event => event.preventDefault());

        this.#playButton.click();
    }

    private setPlayers(value: Player[]) {
        this.#players = value;
    }

    private onResetButtonToggle(): void {
        if (this.#resetButton.toggled) {
            this.#resetModal.show();

            if (this.#playButton.toggled) {
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

        if (!this.#playButton.toggled) {
            this.#playButton.click();
        }
    }

    private onNoResetButtonClick(): void {
        this.#resetModal.close();
    }

    private onYesResetButtonClick(): void {
        document.dispatchEvent(new Event("gamereset"));
        this.#playButton.enabled = true;

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
        if (!this.#playButton.enabled) return;
        this.#playButton.toggle();
    }

    private onUserButtonToggle(): void {
        if (this.#userButton.toggled) {
            this.#playerModal.show();

            if (this.#playButton.toggled) {
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

        if (!this.#playButton.toggled) {
            this.#playButton.click();
        }
    }

    private onPlayerFormSubmit(formData: FormData): void {
        const nameOne = formData.get("playerOne")?.toString().trim();
        const nameTwo = formData.get("playerTwo")?.toString().trim();
    
        const playerOne = this.#players[0];
        const playerTwo = this.#players[1];
        
        playerOne.name = nameOne || "Player 1";
        playerTwo.name = nameTwo || "Player 2";

        this.#observable.update(this.#players);

        this.#playerModal.close();
    }

    private onGameover() {
        const winner = this.#players.find(player => player.winner);
        const message = winner ? `${winner.name} has won!` : "It's a draw!";

        if (this.#playButton.toggled) {
            this.#playButton.click();
        }

        this.#playButton.enabled = false;

        setTimeout(() => {
            const winnerText = UI.getElementById("winnerText");
            winnerText.innerText = message;

            this.#winnerModal.show();
        }, 1000);
    }

    private onWinnerModalClose(): void {
        const winnerText = UI.getElementById("winnerText");
        winnerText.innerText = "";

        if (!this.#resetButton.toggled) {
            this.#resetButton.click();
        }
    }

    private onOkWinnerButtonClick(): void {
        this.#winnerModal.close();
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

    private static createForm(id: string): Form {
        const element = UI.getElementById(id);
        if (!(element instanceof HTMLFormElement)) {
            throw Error(`The element with id "#${id}" is not a form.`);
        }
        
        return new Form(element);
    }
}