import type { RemoveFileFileSystemAdapter } from '../adapters';
import { createRemoveFileSystemAdapter } from '../adapters';

export interface RemoveOptions {
	force?: boolean;
	fs?: Partial<RemoveFileFileSystemAdapter>;
	recursive?: boolean;
}

export class RemoveSettings {
	public readonly force: boolean;
	public readonly fs: RemoveFileFileSystemAdapter;
	public readonly recursive: boolean;

	constructor(options: RemoveOptions = {}) {
		this.fs = createRemoveFileSystemAdapter(options.fs);
		this.force = this.#getValue(options.force, true);
		this.recursive = this.#getValue(options.recursive, true);
	}

	static getSettings(optionsOrSettings: RemoveOptions | RemoveSettings = {}): RemoveSettings {
		if (optionsOrSettings instanceof RemoveSettings) {
			return optionsOrSettings;
		}

		return new RemoveSettings(optionsOrSettings);
	}

	#getValue<T>(option: T | undefined, value: T): T {
		return option ?? value;
	}
}

export type RemoveOptionsOrSettings = RemoveOptions | RemoveSettings | undefined;
