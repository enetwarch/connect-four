import Observable from "./observable.ts";
import Player from "../modules/player.ts";
import Board from "../modules/board.ts";
import Cell from "../modules/cell.ts";

export default class Game {
    #observable: Observable;
    #players: Player[];
    #board: Board;

    #paused: boolean;
    #finished: boolean;

    public constructor(observable: Observable) {
        this.#observable = observable;
        this.#players = this.#observable.players;
        this.#observable.subscribe(this.setPlayers.bind(this));

        const boardElement = document.getElementById("board");
        if (!(boardElement instanceof HTMLDivElement)) {
            throw Error(`"#board" id is not a div.`);
        }
        
        const grid = Game.createBoardGrid(6, 7);
        this.#board = new Board(boardElement, grid);
        this.#board.onCellClick(this.playTurn.bind(this));

        this.#paused = false;
        this.#finished = false;

        document.addEventListener("gamepause", () => this.#paused = true);
        document.addEventListener("gameresume", () => this.#paused = false);
        document.addEventListener("gamereset", this.reset.bind(this));

        this.reset();
    }

    private setPlayers(value: Player[]) {
        this.#players = value;
    }

    private reset(): void {
        this.#paused = false;
        this.#finished = false;

        this.#board.reset();

        this.#players.forEach(player => {
            player.turn = false
            player.winner = false;
        });

        const playerOne = this.#players[0];
        playerOne.turn = true;

        this.#observable.update(this.#players);
    }

    private playTurn(cell: Cell): void {
        if (this.#paused || this.#finished) return;

        const currentPlayer = this.#players.find(player => player.turn);
        if (!currentPlayer) {
            throw Error("No player with turn found.");
        }

        this.#board.insertColor(currentPlayer.color, cell.coordinates);

        const winner = this.#board.isWinner(currentPlayer.color);
        if (winner) {
            this.#finished = true;
            currentPlayer.winner = true;
            document.dispatchEvent(new Event("gameover"));

            this.#board.highlightWinnerCells(winner);
        } else if (this.#board.isEveryCellColored()) {
            this.#finished = true;
            document.dispatchEvent(new Event("gameover"));
        } else {
            const nextPlayer = this.getNextPlayer(currentPlayer);

            currentPlayer.turn = false;
            nextPlayer.turn = true;
        }

        this.#observable.update(this.#players);
    }

    private getNextPlayer(currentPlayer: Player | undefined): Player {
        if (currentPlayer === undefined) {
            currentPlayer = this.#players.find(player => player.turn);
        }

        if (!currentPlayer) {
            const nextPlayer = this.#players[0];
            return nextPlayer;
        }

        const nextPlayerIndex = this.#players.indexOf(currentPlayer) + 1;
        const nextPlayer = this.#players[nextPlayerIndex % this.#players.length];
        return nextPlayer;
    }

    private static createBoardGrid(rows: number, columns: number): Cell[][] {
        const grid = Array.from({ length: rows }, (_, x) => {
            return Array.from({ length: columns }, (_, y) => new Cell([x, y]));
        });

        return grid;
    }
}