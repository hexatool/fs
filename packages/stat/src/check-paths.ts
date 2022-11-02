import { basename } from 'node:path';

import type { BigIntStats, Stats } from 'node:fs';

import areIdentical from './are-identical';
import errorMessage from './error-message';
import { getStats, getStatsSync } from './get-stats';
import isSrcSubdirectory from './is-src-subdirectory';
import type { CheckStatsResult, FunctionName, GetStatsOptions } from './types';

function internalCheck(
	src: string,
	srcStat: BigIntStats | Stats,
	dest: string,
	destStat: BigIntStats | Stats | undefined,
	funcName: FunctionName
): CheckStatsResult {
	if (destStat) {
		if (areIdentical(srcStat, destStat)) {
			const srcBaseName = basename(src);
			const destBaseName = basename(dest);
			if (
				funcName === 'move' &&
				srcBaseName !== destBaseName &&
				srcBaseName.toLowerCase() === destBaseName.toLowerCase()
			) {
				return { srcStat, destStat, isChangingCase: true };
			}
			throw new Error('Source and destination must not be the same.');
		}
		if (srcStat.isDirectory() && !destStat.isDirectory()) {
			throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
		}
		if (!srcStat.isDirectory() && destStat.isDirectory()) {
			throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
		}
	}

	if (srcStat.isDirectory() && isSrcSubdirectory(src, dest)) {
		throw new Error(errorMessage(src, dest, funcName));
	}

	return { srcStat, destStat };
}

export async function checkPaths(
	src: string,
	dest: string,
	funcName: FunctionName,
	opts?: GetStatsOptions
): Promise<CheckStatsResult> {
	const { srcStat, destStat } = await getStats(src, dest, opts);

	return internalCheck(src, srcStat, dest, destStat, funcName);
}

export function checkPathsSync(
	src: string,
	dest: string,
	funcName: FunctionName,
	opts?: GetStatsOptions
): CheckStatsResult {
	const { srcStat, destStat } = getStatsSync(src, dest, opts);

	return internalCheck(src, srcStat, dest, destStat, funcName);
}

export default {
	checkPathsSync,
};
