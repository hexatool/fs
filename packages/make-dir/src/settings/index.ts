import type { Mode } from 'node:fs';

import type { MakeDirFileSystemAdapter } from '../adapters';
import { createMakeDirFileSystemAdapter } from '../adapters';

export interface MakeDirOptions {
	fs?: Partial<MakeDirFileSystemAdapter>;
	mode?: Mode;
}

export class MakeDirSettings {
	public readonly fs: MakeDirFileSystemAdapter;
	public readonly mode: Mode;

	constructor(options: MakeDirOptions = {}) {
		this.fs = createMakeDirFileSystemAdapter(options.fs);
		this.mode = this.#getValue(options.mode, 0o777);
	}

	static getSettings(
		optionsOrSettings: MakeDirOptions | MakeDirSettings | Mode = {}
	): MakeDirSettings {
		if (optionsOrSettings instanceof MakeDirSettings) {
			return optionsOrSettings;
		}
		if (typeof optionsOrSettings === 'string' || typeof optionsOrSettings === 'number') {
			return new MakeDirSettings({
				mode: optionsOrSettings,
			});
		}

		return new MakeDirSettings(optionsOrSettings);
	}

	#getValue<T>(option: T | undefined, value: T): T {
		return option ?? value;
	}
}

export type MakeDirOptionsOrSettings = MakeDirOptions | MakeDirSettings | undefined;
