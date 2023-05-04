import type { EmptyDirFileSystemAdapter } from '../adapters';
import { emptyDirFileSystemAdapter } from '../adapters';

export interface EmptyDirOptions {
	fs?: Partial<EmptyDirFileSystemAdapter>;
}

export class EmptyDirSettings {
	public readonly fs: EmptyDirFileSystemAdapter;

	constructor(options: EmptyDirOptions = {}) {
		this.fs = emptyDirFileSystemAdapter(options.fs);
	}

	static getSettings(
		optionsOrSettings: EmptyDirOptions | EmptyDirSettings = {}
	): EmptyDirSettings {
		if (optionsOrSettings instanceof EmptyDirSettings) {
			return optionsOrSettings;
		}

		return new EmptyDirSettings(optionsOrSettings);
	}
}

export type EmptyDirOptionsOrSettings = EmptyDirOptions | EmptyDirSettings | undefined;
