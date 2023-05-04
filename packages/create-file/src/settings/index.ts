import type { CreateFileFileSystemAdapter } from '../adapters';
import { createFileFileSystemAdapter } from '../adapters';

export interface CreateFileOptions {
	fs?: Partial<CreateFileFileSystemAdapter>;
}

export class CreateFileSettings {
	public readonly fs: CreateFileFileSystemAdapter;

	constructor(options: CreateFileOptions = {}) {
		this.fs = createFileFileSystemAdapter(options.fs);
	}

	static getSettings(
		optionsOrSettings: CreateFileOptions | CreateFileSettings = {}
	): CreateFileSettings {
		if (optionsOrSettings instanceof CreateFileSettings) {
			return optionsOrSettings;
		}

		return new CreateFileSettings(optionsOrSettings);
	}
}

export type CreateFileOptionsOrSettings = CreateFileOptions | CreateFileSettings | undefined;
