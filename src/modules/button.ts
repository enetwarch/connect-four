export default class Button {
	#element: HTMLButtonElement;
	#toggled: boolean;
	#enabled: boolean;

	public constructor(element: HTMLButtonElement) {
		this.#element = element;
		this.#toggled = false;
		this.#enabled = true;
	}

	public get toggled(): boolean {
		return this.#toggled;
	}

	public get enabled(): boolean {
		return this.#enabled;
	}

	public set toggled(value: boolean) {
		this.#toggled = value;
	}

	public set enabled(value: boolean) {
		this.#enabled = value;
	}

	public click(): void {
		if (!this.#enabled) return;

		this.#element.click();
	}

	public toggle(): void {
		if (!this.#enabled) return;

		this.#toggled = !this.#toggled;
		this.#element.dispatchEvent(new Event("toggle"));

		this.invert();
	}

	public addEventListener(type: string, callback: EventListener): void {
		this.#element.addEventListener(type, callback);
	}

	public removeEventListener(type: string, callback: EventListener): void {
		this.#element.removeEventListener(type, callback);
	}

	public changeIcon(iconClass: string): void {
		const icon = this.#element.querySelector("i");
		if (!icon) {
			throw Error(`${this.#element} does not have an icon.`);
		} else if (icon.classList.length === 0) {
			throw Error(`${this.#element} does not have any class.`);
		}

		const lastElement = icon.classList[icon.classList.length - 1];
		icon.classList.remove(lastElement);
		icon.classList.add(iconClass);
	}

	private invert(invertClass = "inverted"): void {
		this.#element.classList.toggle(invertClass);
	}
}
