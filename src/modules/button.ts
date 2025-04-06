export default class Button {
    #element: HTMLButtonElement;
    #toggled: boolean;
    #enabled: boolean;

    constructor(element: HTMLButtonElement) {
        this.#element = element;
        this.#toggled = false;
        this.#enabled = true;
    }

    get toggled(): boolean {
        return this.#toggled;
    }

    get enabled(): boolean {
        return this.#enabled;
    }

    set toggled(value: boolean) {
        this.#toggled = value;
    }

    set enabled(value: boolean) {
        this.#enabled = value;
    }

    addEventListener(type: string, callback: EventListener): void {
        this.#element.addEventListener(type, callback);
    }

    removeEventListener(type: string, callback: EventListener): void {
        this.#element.removeEventListener(type, callback);
    }

    click(): void {
        this.#element.click();
    }

    toggle(): void {
        this.toggled = !this.toggled;
        this.#element.dispatchEvent(new Event("toggle"));

        this.invert();
    }

    invert(invertClass = "inverted"): void {
        this.#element.classList.toggle(invertClass);
    }

    changeIcon(iconClass: string): void {
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
}