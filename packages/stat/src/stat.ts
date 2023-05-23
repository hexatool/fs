import type { BigIntStats, Stats } from 'node:fs';

import type {
	BigIntStatOptionsOrSettings,
	NoBigIntStatOptions,
	NoBigIntStatOptionsOrSettings,
} from './settings';
import { BigIntStatSettings, NoBigIntStatSettings, StatSettings } from './settings';

export async function statAsync(path: string): Promise<Stats>;
export async function statAsync(
	path: string,
	settingsOrOptions: NoBigIntStatOptionsOrSettings
): Promise<Stats>;
export async function statAsync(
	path: string,
	settingsOrOptions: BigIntStatOptionsOrSettings
): Promise<BigIntStats>;
export async function statAsync(
	path: string,
	settingsOrOptions: BigIntStatOptionsOrSettings | NoBigIntStatOptionsOrSettings = {}
): Promise<BigIntStats | Stats> {
	const { fs, followSymbolicLink, markSymbolicLink, throwErrorOnBrokenSymbolicLink, bigint } =
		settingsOrOptions.bigint
			? BigIntStatSettings.getSettings(settingsOrOptions)
			: NoBigIntStatSettings.getSettings(
					settingsOrOptions as NoBigIntStatOptions | StatSettings
			  );
	const lstat = await fs.lstat(path, {
		bigint,
	});

	if (!lstat.isSymbolicLink() || !followSymbolicLink) {
		return lstat;
	}

	try {
		const stat = await fs.stat(path, {
			bigint,
		});

		if (markSymbolicLink) {
			stat.isSymbolicLink = () => true;
		}

		return stat;
	} catch (error: unknown) {
		if (!throwErrorOnBrokenSymbolicLink) {
			return lstat;
		}

		throw error;
	}
}

export function statSync(path: string): Stats;
export function statSync(path: string, settingsOrOptions: NoBigIntStatOptionsOrSettings): Stats;
export function statSync(path: string, settingsOrOptions: BigIntStatOptionsOrSettings): BigIntStats;
export function statSync(
	path: string,
	settingsOrOptions: BigIntStatOptionsOrSettings | NoBigIntStatOptionsOrSettings = {}
): BigIntStats | Stats {
	const { fs, followSymbolicLink, markSymbolicLink, throwErrorOnBrokenSymbolicLink, bigint } =
		settingsOrOptions.bigint
			? BigIntStatSettings.getSettings(settingsOrOptions)
			: NoBigIntStatSettings.getSettings(
					settingsOrOptions as NoBigIntStatOptions | StatSettings
			  );
	const lstat = fs.lstatSync(path, {
		bigint,
	});

	if (!lstat.isSymbolicLink() || !followSymbolicLink) {
		return lstat;
	}

	try {
		const stat = fs.statSync(path, {
			bigint,
		});

		if (markSymbolicLink) {
			stat.isSymbolicLink = () => true;
		}

		return stat;
	} catch (error: unknown) {
		if (!throwErrorOnBrokenSymbolicLink) {
			return lstat;
		}

		throw error;
	}
}
