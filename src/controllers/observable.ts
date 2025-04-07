import type Player from "../modules/player.ts";

type Observer = (arg: Player[]) => void;

export default class Observable {
	#players: Player[];
	#observers: Observer[];

	public constructor(players: Player[]) {
		this.#players = players;
		this.#observers = [];
	}

	public get players(): Player[] {
		return this.#players;
	}

	public subscribe(observer: Observer) {
		this.#observers.push(observer);
	}

	public unsubscribe(observer: Observer) {
		const index = this.#observers.indexOf(observer);
		if (index === -1) {
			throw Error(`${observer} observer does not exist.`);
		}

		this.#observers.splice(index, 1);
	}

	public update(players: Player[]) {
		if (players.length !== this.#players.length) {
			throw Error("players argument exceeded expected length.");
		}

		this.#players = players;
		this.notify(this.#players);
	}

	private notify(data: Player[]) {
		for (const observer of this.#observers) {
			observer(data);
		}
	}
}
