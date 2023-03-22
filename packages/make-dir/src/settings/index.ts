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
		settingsOrOptions: MakeDirOptions | MakeDirSettings | Mode = {}
	): MakeDirSettings {
		if (settingsOrOptions instanceof MakeDirSettings) {
			return settingsOrOptions;
		}
		if (typeof settingsOrOptions === 'string' || typeof settingsOrOptions === 'number') {
			return new MakeDirSettings({
				mode: settingsOrOptions,
			});
		}

		return new MakeDirSettings(settingsOrOptions);
	}

	#getValue<T>(option: T | undefined, value: T): T {
		return option ?? value;
	}
}

export type MakeDirSettingsOrOptions = MakeDirOptions | MakeDirSettings | undefined;
