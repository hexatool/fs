import type { StatFileSystemAdapter } from '../adapters';
import { createStatFileSystemAdapter } from '../adapters';

export interface StatOptions {
	followSymbolicLink?: boolean;
	fs?: Partial<StatFileSystemAdapter>;
	markSymbolicLink?: boolean;
	throwErrorOnBrokenSymbolicLink?: boolean;
}

export class StatSettings {
	public readonly followSymbolicLink: boolean;
	public readonly fs: StatFileSystemAdapter;
	public readonly markSymbolicLink: boolean;
	public readonly throwErrorOnBrokenSymbolicLink: boolean;

	constructor(options: StatOptions = {}) {
		this.fs = createStatFileSystemAdapter(options.fs);
		this.followSymbolicLink = this.#getValue(options.followSymbolicLink, false);
		this.markSymbolicLink = this.#getValue(options.markSymbolicLink, false);
		this.throwErrorOnBrokenSymbolicLink = this.#getValue(
			options.throwErrorOnBrokenSymbolicLink,
			true
		);
	}

	static getSettings(optionsOrSettings: StatOptions | StatSettings = {}): StatSettings {
		if (optionsOrSettings instanceof StatSettings) {
			return optionsOrSettings;
		}

		return new StatSettings(optionsOrSettings);
	}

	#getValue<T>(option: T | undefined, value: T): T {
		return option ?? value;
	}
}

export type StatOptionsOrSettings = StatOptions | StatSettings | undefined;
