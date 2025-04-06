export default class Form {
    #element: HTMLFormElement;
    #fields: (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[];
    #submitEvent: EventListener;

    constructor(element: HTMLFormElement) {
        this.#element = element;

        this.#fields = Array.from(this.#element.querySelectorAll("[name]"));
        if (this.#fields.length === 0) {
            throw Error(`${this.#element} does not have fields with name attribute.`);
        }

        this.#submitEvent = () => {};
    }

    submit(): void {
        this.#element.dispatchEvent(new Event("submit"));
    }

    reset(): void {
        this.#element.reset();
    }

    onSubmit(submit: (formData: FormData) => void): void {
        this.#element.removeEventListener("submit", this.#submitEvent);

        this.#submitEvent = event => {
            event.preventDefault();

            const formData = new FormData(this.#element);
            submit(formData);

            this.reset();
        }

        this.#element.addEventListener("submit", this.#submitEvent);
    }

    insertValues(values: { [key: string]: string }): void {
        Object.entries(values).forEach(([key, value]) => {
            this.#fields.forEach(field => {
                if (field.name === key) {
                    field.value === value;
                }
            });
        });
    }
}