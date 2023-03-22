import type { FileSystemAdapter } from '../adapters';
import { createRemoveFileSystemAdapter } from '../adapters';

export interface RemoveOptions {
	force?: boolean;
	fs?: Partial<FileSystemAdapter>;
	recursive?: boolean;
}

export class RemoveSettings {
	public readonly force: boolean;
	public readonly fs: FileSystemAdapter;
	public readonly recursive: boolean;

	constructor(options: RemoveOptions = {}) {
		this.fs = createRemoveFileSystemAdapter(options.fs);
		this.force = this.#getValue(options.force, true);
		this.recursive = this.#getValue(options.recursive, true);
	}

	static getSettings(settingsOrOptions: RemoveOptions | RemoveSettings = {}): RemoveSettings {
		if (settingsOrOptions instanceof RemoveSettings) {
			return settingsOrOptions;
		}

		return new RemoveSettings(settingsOrOptions);
	}

	#getValue<T>(option: T | undefined, value: T): T {
		return option ?? value;
	}
}

export type RemoveSettingsOrOptions = RemoveOptions | RemoveSettings | undefined;
