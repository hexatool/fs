import type { BigIntStats, Stats } from 'node:fs';
import path from 'node:path';

import { fs } from '@hexatool/fs-file-system';

import areIdentical from './are-identical';
import errorMessage from './error-message';
import type { ErrorWithCode, FunctionName } from './types';

export async function checkParentPathsAsync(
	src: string,
	srcStat: BigIntStats | Stats,
	dest: string,
	funcName: FunctionName
): Promise<void> {
	const srcParent = path.resolve(path.dirname(src));
	const destParent = path.resolve(path.dirname(dest));
	if (destParent === srcParent || destParent === path.parse(destParent).root) {
		return;
	}

	let destStat;

	try {
		destStat = await fs.promises.stat(destParent, { bigint: true });
	} catch (e) {
		const err = e as ErrorWithCode;
		if (err.code === 'ENOENT') {
			return;
		}
		throw err;
	}
	if (areIdentical(srcStat, destStat)) {
		throw new Error(errorMessage(src, dest, funcName));
	}

	await checkParentPathsAsync(src, srcStat, destParent, funcName);
}

export function checkParentPathsSync(
	src: string,
	srcStat: BigIntStats | Stats,
	dest: string,
	funcName: FunctionName
): void {
	const srcParent = path.resolve(path.dirname(src));
	const destParent = path.resolve(path.dirname(dest));
	if (destParent === srcParent || destParent === path.parse(destParent).root) {
		return;
	}

	let destStat;

	try {
		destStat = fs.statSync(destParent, { bigint: true });
	} catch (e) {
		const err = e as ErrorWithCode;
		if (err.code === 'ENOENT') {
			return;
		}
		throw err;
	}
	if (areIdentical(srcStat, destStat)) {
		throw new Error(errorMessage(src, dest, funcName));
	}

	checkParentPathsSync(src, srcStat, destParent, funcName);
}
