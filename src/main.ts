import "./styles/style.css";
import Game from "./controllers/game.ts";
import Observable from "./controllers/observable.ts";
import UI from "./controllers/ui.ts";
import Player from "./modules/player.ts";

type Color = "" | "red" | "blue";

interface Save {
	name: string;
	color: Color;
	number: number;
}

window.addEventListener("load", () => {
	const players: Player[] = [];

	const storedPlayers = localStorage.getItem("players");
	if (!storedPlayers) {
		players.push(new Player("", "red", 1));
		players.push(new Player("", "blue", 2));
	} else {
		const parsedPlayers: Save[] = JSON.parse(storedPlayers);

		for (const player of parsedPlayers) {
			players.push(new Player(player.name, player.color, player.number));
		}
	}

	const observable = new Observable(players);

	new UI(observable);
	new Game(observable);

	window.addEventListener("beforeunload", () => {
		const players: Save[] = [];
		const sessionPlayers: Player[] = observable.players;

		for (const player of sessionPlayers) {
			const save: Save = {
				name: player.name,
				color: player.color,
				number: player.number,
			};

			players.push(save);
		}

		localStorage.setItem("players", JSON.stringify(players));
	});
});
