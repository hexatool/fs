import type { BigIntStats, Stats } from 'node:fs';
import path from 'node:path';

import areIdentical from './are-identical';
import errorMessage from './error-message';
import type { StatOptionsOrSettings } from './settings';
import { statAsync, statSync } from './stat';
import type { ErrorWithCode, FunctionName } from './types';

export async function checkParentPathsAsync(
	src: string,
	srcStat: BigIntStats | Stats,
	dest: string,
	funcName: FunctionName,
	optionsOrSettings: StatOptionsOrSettings = {}
): Promise<void> {
	const srcParent = path.resolve(path.dirname(src));
	const destParent = path.resolve(path.dirname(dest));
	if (destParent === srcParent || destParent === path.parse(destParent).root) {
		return;
	}

	let destStat;

	try {
		destStat = await statAsync(destParent, { ...optionsOrSettings, bigint: true });
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
	funcName: FunctionName,
	optionsOrSettings: StatOptionsOrSettings = {}
): void {
	const srcParent = path.resolve(path.dirname(src));
	const destParent = path.resolve(path.dirname(dest));
	if (destParent === srcParent || destParent === path.parse(destParent).root) {
		return;
	}

	let destStat;

	try {
		destStat = statSync(destParent, { ...optionsOrSettings, bigint: true });
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
