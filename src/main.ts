import "./styles/style.css";
import Player from "./modules/player.ts";
import UI from "./controllers/ui.ts";
import Game from "./controllers/game.ts";

window.addEventListener("load", () => {
    const players = [
        new Player("Zero", "red", 1),
        new Player("Bloom", "blue", 2)
    ];

    new UI();
    new Game(players);
});