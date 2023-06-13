import { App, Modal, TextComponent } from "obsidian";

export class ExampleModal extends Modal {
	result: string;
	title: string;
	onSubmit: (result: string) => void;
	input: TextComponent;

	constructor(app: App, title: string, onSubmit: (result: string) => void) {
		super(app);
		this.onSubmit = onSubmit;
		this.title = title;
	}

	onOpen() {
		const { contentEl } = this;

		const inputContainer = contentEl.createDiv({ cls: "input-container" });
		this.input = new TextComponent(inputContainer)
			.setPlaceholder(this.title)
			.onChange((value) => {
				this.result = value;
			});

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Enter") {
				this.close();
				this.onSubmit(this.result);
			}
		};

		this.input.inputEl.addEventListener("keydown", handleKeyDown);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
