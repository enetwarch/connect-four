// @vitest-environment happy-dom
import Game from "../../src/controllers/game.ts";
import Observable from "../../src/controllers/observable.ts";
import Player from "../../src/modules/player.ts";

describe("game", () => {
	let players: Player[];
	let mockBoardElement: HTMLDivElement;
	let observable: Observable;
	let game: Game;

	beforeEach(() => {
		players = [
			new Player("Player 1", "red", 1),
			new Player("Player 2", "blue", 2),
		];

		mockBoardElement = document.createElement("div");
		mockBoardElement.id = "board";
		document.body.appendChild(mockBoardElement);

		observable = new Observable(players);
		game = new Game(observable);
	});

	it("should start in an unpaused and unfinished state", () => {
		expect(game.paused).toBe(false);
		expect(game.finished).toBe(false);
	});

	it("should initialize its players variables based on the observable", () => {
		const players = game.players;
		expect(players.length).toBe(2);

		const playerOne = players[0];
		expect(playerOne.name).toBe("Player 1");
		expect(playerOne.color).toBe("red");
		expect(playerOne.number).toBe(1);

		const playerTwo = players[1];
		expect(playerTwo.name).toBe("Player 2");
		expect(playerTwo.color).toBe("blue");
		expect(playerTwo.number).toBe(2);
	});

	it("should start with player one's turn", () => {
		const playerOne = game.players[0];
		const playerTwo = game.players[1];

		expect(playerOne.turn).toBe(true);
		expect(playerTwo.turn).toBe(false);
	});

	it("should be able to pause and resume", () => {
		expect(game.paused).toBe(false);

		game.pause();
		expect(game.paused).toBe(true);

		game.resume();
		expect(game.paused).toBe(false);
	});

	it("should pause and resume based on gamepause and gameresume events", () => {
		expect(game.paused).toBe(false);

		document.dispatchEvent(new Event("gamepause"));
		expect(game.paused).toBe(true);

		document.dispatchEvent(new Event("gameresume"));
		expect(game.paused).toBe(false);
	});

	it("should switch the turn of the players when someone plays a move", () => {
		expect(game.players[0].turn).toBe(true);
		expect(game.players[1].turn).toBe(false);

		const cell = game.board.findCell([0, 0]);
		if (!cell) {
			assert.fail("there should be a cell.");
		} else {
			game.playTurn(cell);
		}

		expect(game.players[0].turn).toBe(false);
		expect(game.players[1].turn).toBe(true);
	});

	it("should know who the next player is", () => {
		expect(game.players[0].turn).toBe(true);

		const currentPlayer = game.players.find((player) => player.turn);
		if (!currentPlayer) {
			assert.fail("there needs to be a player with a turn.");
		}

		const nextPlayer = game.getNextPlayer(currentPlayer);
		expect(nextPlayer).toBe(game.players[1]);
	});

	it("should be able to reset", () => {
		const cell = game.board.findCell([5, 0]);
		if (!cell) {
			assert.fail("there should be a cell.");
		} else {
			game.playTurn(cell);
			game.pause();
		}

		expect(cell.color).toBe("red");
		expect(game.players[0].turn).toBe(false);
		expect(game.players[1].turn).toBe(true);
		expect(game.paused).toBe(true);

		game.reset();

		expect(cell.color).toBe("");
		expect(game.players[0].turn).toBe(true);
		expect(game.players[1].turn).toBe(false);
		expect(game.paused).toBe(false);
	});

	it("should reset based on the gamereset event", () => {
		const cell = game.board.findCell([5, 0]);
		if (!cell) {
			assert.fail("there should be a cell.");
		} else {
			game.playTurn(cell);
			game.pause();
		}

		expect(cell.color).toBe("red");
		expect(game.players[0].turn).toBe(false);
		expect(game.players[1].turn).toBe(true);
		expect(game.paused).toBe(true);

		document.dispatchEvent(new Event("gamereset"));

		expect(cell.color).toBe("");
		expect(game.players[0].turn).toBe(true);
		expect(game.players[1].turn).toBe(false);
		expect(game.paused).toBe(false);
	});

	it("should not play turn when the game is paused", () => {
		game.pause();
		for (let i = 0; i < 10; i++) {
			const y = i % 2;
			const cell = game.board.findCell([0, y]);

			if (!cell) {
				assert.fail("there needs to be a cell.");
			} else {
				game.playTurn(cell);
			}
		}

		expect(game.paused).toBe(true);
		expect(game.board.coloredCoordinates).toEqual([]);
	});

	it("should finish when someone has 4 consecutive colors", () => {
		for (let i = 0; i < 100; i++) {
			if (game.finished) break;

			const y = i % 2;
			const cell = game.board.findCell([0, y]);

			if (!cell) {
				assert.fail("there needs to be a cell.");
			} else {
				game.playTurn(cell);
			}
		}

		expect(game.finished).toBe(true);
		expect(game.board.coloredCoordinates).toEqual([
			[2, 0],
			[3, 0],
			[3, 1],
			[4, 0],
			[4, 1],
			[5, 0],
			[5, 1],
		]);
	});
});
