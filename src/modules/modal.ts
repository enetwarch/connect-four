export default class Modal {
    #element: HTMLDialogElement;
    #closeButton: HTMLButtonElement;
    #shown: boolean;

    public constructor(element: HTMLDialogElement, closeButton: HTMLButtonElement) {
        this.#element = element;
        this.#closeButton = closeButton;
        this.#shown = false;

        document.addEventListener("keydown", this.onEscapeKey.bind(this));
        this.#element.addEventListener("click", this.onOverlayClick.bind(this));
        this.#closeButton.addEventListener("click", this.onCloseButtonClick.bind(this));
    }

    show(): void {
        if (this.#shown) return;
        this.#shown = true;

        this.#element.dispatchEvent(new Event("show"));
        this.#element.showModal();
    }

    close(): void {
        if (!this.#shown) return;
        this.#shown = false;

        this.#element.close();
        this.#element.dispatchEvent(new Event("close"));
    }
    
    addEventListener(type: string, callback: EventListener): void {
        this.#element.addEventListener(type, callback);
    }

    removeEventListener(type: string, callback: EventListener): void {
        this.#element.removeEventListener(type, callback);
    }

    onEscapeKey(event: KeyboardEvent): void {
        if (event.code === "Escape" && this.#shown) {
            event.preventDefault();
            this.close();
        }
    }

    onOverlayClick(event: MouseEvent): void {
        if (event.target === this.#element) {
            this.close();
        }
    }

    onCloseButtonClick(): void {
        this.close();
    }
}