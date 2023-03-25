import type { StatFileSystemAdapter } from '../adapters';
import { createStatFileSystemAdapter } from '../adapters';

export interface StatOptions {
	followSymbolicLink?: boolean;
	fs?: Partial<StatFileSystemAdapter>;
	markSymbolicLink?: boolean;
	throwErrorOnBrokenSymbolicLink?: boolean;
}

export interface NoBigIntStatOptions {
	bigint?: false | undefined;
	followSymbolicLink?: boolean;
	fs?: Partial<StatFileSystemAdapter>;
	markSymbolicLink?: boolean;
	throwErrorOnBrokenSymbolicLink?: boolean;
}

export interface BigIntStatOptions {
	bigint?: true;
	followSymbolicLink?: boolean;
	fs?: Partial<StatFileSystemAdapter>;
	markSymbolicLink?: boolean;
	throwErrorOnBrokenSymbolicLink?: boolean;
}

export class StatSettings {
	public readonly bigint: boolean;
	public readonly followSymbolicLink: boolean;
	public readonly fs: StatFileSystemAdapter;
	public readonly markSymbolicLink: boolean;
	public readonly throwErrorOnBrokenSymbolicLink: boolean;

	constructor(options: BigIntStatOptions | NoBigIntStatOptions = {}) {
		this.fs = createStatFileSystemAdapter(options.fs);
		this.followSymbolicLink = this.#getValue(options.followSymbolicLink, false);
		this.markSymbolicLink = this.#getValue(options.markSymbolicLink, false);
		this.bigint = this.#getValue(options.bigint, false);
		this.throwErrorOnBrokenSymbolicLink = this.#getValue(
			options.throwErrorOnBrokenSymbolicLink,
			true
		);
	}

	#getValue<T>(option: T | undefined, value: T): T {
		return option ?? value;
	}
}

export class NoBigIntStatSettings extends StatSettings {
	constructor(options: NoBigIntStatOptions = {}) {
		super(options);
	}

	static getSettings(
		optionsOrSettings: NoBigIntStatOptions | StatSettings = {}
	): NoBigIntStatSettings {
		if (optionsOrSettings instanceof StatSettings) {
			return optionsOrSettings;
		}

		return new StatSettings(optionsOrSettings);
	}
}

export class BigIntStatSettings extends StatSettings {
	constructor(options: BigIntStatOptions = {}) {
		super(options);
	}

	static getSettings(
		optionsOrSettings: BigIntStatOptions | StatSettings = {}
	): BigIntStatSettings {
		if (optionsOrSettings instanceof StatSettings) {
			return optionsOrSettings;
		}

		return new StatSettings(optionsOrSettings);
	}
}

export type StatOptionsOrSettings = StatOptions | StatSettings | undefined;
export type NoBigIntStatOptionsOrSettings = NoBigIntStatOptions | StatSettings | undefined;
export type BigIntStatOptionsOrSettings = BigIntStatOptions | StatSettings | undefined;
