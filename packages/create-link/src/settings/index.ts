import type { CreateLinkFileSystemAdapter } from '../adapters';
import { createLinkFileSystemAdapter } from '../adapters';

export interface CreateLinkOptions {
	fs?: Partial<CreateLinkFileSystemAdapter>;
}

export class CreateLinkSettings {
	public readonly fs: CreateLinkFileSystemAdapter;

	constructor(options: CreateLinkOptions = {}) {
		this.fs = createLinkFileSystemAdapter(options.fs);
	}

	static getSettings(
		optionsOrSettings: CreateLinkOptions | CreateLinkSettings = {}
	): CreateLinkSettings {
		if (optionsOrSettings instanceof CreateLinkSettings) {
			return optionsOrSettings;
		}

		return new CreateLinkSettings(optionsOrSettings);
	}
}

export type CreateLinkOptionsOrSettings = CreateLinkOptions | CreateLinkSettings | undefined;
