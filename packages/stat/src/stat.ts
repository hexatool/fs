import type { Stats } from 'node:fs';

import { StatOptionsOrSettings, StatSettings } from './settings';

export async function statAsync(
	path: string,
	settingsOrOptions?: StatOptionsOrSettings
): Promise<Stats> {
	const { fs, followSymbolicLink, markSymbolicLink, throwErrorOnBrokenSymbolicLink } =
		StatSettings.getSettings(settingsOrOptions);
	const lstat = await fs.lstat(path);

	if (!lstat.isSymbolicLink() || !followSymbolicLink) {
		return lstat;
	}

	try {
		const stat = await fs.stat(path);

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

export function statSync(path: string, settingsOrOptions?: StatOptionsOrSettings): Stats {
	const { fs, followSymbolicLink, markSymbolicLink, throwErrorOnBrokenSymbolicLink } =
		StatSettings.getSettings(settingsOrOptions);
	const lstat = fs.lstatSync(path);

	if (!lstat.isSymbolicLink() || !followSymbolicLink) {
		return lstat;
	}

	try {
		const stat = fs.statSync(path);

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
