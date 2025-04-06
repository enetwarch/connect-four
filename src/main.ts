import "./styles/style.css";
import Player from "./modules/player.ts";
import Players from "./controllers/observable.ts";
import UI from "./controllers/ui.ts";
import Game from "./controllers/game.ts";

window.addEventListener("load", () => {
    const players = [
        new Player("Zero", "red", 1),
        new Player("Bloom", "blue", 2)
    ];

    const observable = new Players(players);
    
    new UI(observable);
    new Game(observable);
});