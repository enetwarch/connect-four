import Player from "../modules/player.ts";

type Observer = (arg: Player[]) => void;

export default class Observable {
    #players: Player[]
    #observers: Observer[];

    constructor(players: Player[]) {
        this.#players = players;
        this.#observers = [];
    }

    get players(): Player[] {
        return this.#players;
    }

    subscribe(observer: Observer) {
        this.#observers.push(observer);
    }

    unsubscribe(observer: Observer) {
        const index = this.#observers.indexOf(observer);
        if (index === -1) {
            throw Error(`${observer} observer does not exist.`);
        }

        this.#observers.splice(index, 1);
    }

    update(players: Player[]) {
        if (players.length !== this.#players.length) {
            throw Error("players argument exceeded expected length.");
        }

        this.#players = players;
        this.notify(this.#players);
    }

    notify(data: Player[]) {
        this.#observers.forEach(observer => observer(data));
    }
}