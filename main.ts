import { ExampleModal } from "modal";
import { Notice, Plugin, Platform } from "obsidian";
import { execSync } from "child_process";
// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	rootDir: string;
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		if (!Platform.isDesktopApp) {
			return;
		}

		await this.loadSettings();

		if (!this.settings.rootDir) {
			new ExampleModal(
				this.app,
				"Please, write path to the repo",
				async (result) => {
					try {
						await this.saveData({ rootDir: result });
						new Notice(`Root path ${result} saved`);
					} catch (err) {
						new Notice(err.message);
					}
				}
			).open();
		}
		// This creates an icon in the left ribbon.
		this.addRibbonIcon("folder-git-2", "Easy GIT", (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			// new Notice('This is a notice!');

			new ExampleModal(
				this.app,
				"Please, write a commit message",
				(result) => {
					try {
						process.chdir(this.settings.rootDir);
						execSync("git status");
						execSync("git add .");
						execSync(`git commit --amend --no-gpg-sign -m "${result}"`);
						execSync(`git pull origin main --ff-only`)
						execSync(`git push origin main`);
						new Notice(`Pushed to the main branch with "${result}" message`);
					} catch (err) {
						new Notice(err.message);
					}
				}
			).open();
		});
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
