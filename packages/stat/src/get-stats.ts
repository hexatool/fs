import type { PathLike } from 'graceful-fs';
import fs from 'graceful-fs';

import type { ErrorWithCode, GetStatsOptions, StatsResult } from './types';

export async function getStats(
	src: PathLike,
	dest: PathLike,
	opts?: GetStatsOptions
): Promise<StatsResult> {
	const statFunc = opts?.dereference
		? (file: PathLike) => fs.promises.stat(file, { bigint: true })
		: (file: PathLike) => fs.promises.lstat(file, { bigint: true });

	return Promise.all([
		statFunc(src),
		statFunc(dest).catch((err: ErrorWithCode) => {
			if (err.code === 'ENOENT') {
				return undefined;
			}
			throw err;
		}),
	]).then(([srcStat, destStat]) => ({ srcStat, destStat }));
}

export function getStatsSync(src: PathLike, dest: PathLike, opts?: GetStatsOptions): StatsResult {
	let destStat;
	const statFunc = opts?.dereference
		? (file: PathLike) => fs.statSync(file, { bigint: true })
		: (file: PathLike) => fs.lstatSync(file, { bigint: true });
	const srcStat = statFunc(src);
	try {
		destStat = statFunc(dest);
	} catch (e: unknown) {
		const err = e as ErrorWithCode;
		if (err.code === 'ENOENT') {
			return { srcStat, destStat: undefined };
		}
		throw err;
	}

	return { srcStat, destStat };
}
