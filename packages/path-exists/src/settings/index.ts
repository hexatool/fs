import type { PathExistsFileSystemAdapter } from '../adapters';
import { createPathExistsFileSystemAdapter } from '../adapters';

export interface PathExistsOptions {
	fs?: Partial<PathExistsFileSystemAdapter>;
}

export class PathExistsSettings {
	public readonly fs: PathExistsFileSystemAdapter;

	constructor(options: PathExistsOptions = {}) {
		this.fs = createPathExistsFileSystemAdapter(options.fs);
	}

	static getSettings(
		optionsOrSettings: PathExistsOptions | PathExistsSettings = {}
	): PathExistsSettings {
		if (optionsOrSettings instanceof PathExistsSettings) {
			return optionsOrSettings;
		}

		return new PathExistsSettings(optionsOrSettings);
	}
}

export type PathExistsOptionsOrSettings = PathExistsOptions | PathExistsSettings | undefined;
