import { linkSync, Stats, statSync } from 'node:fs';
import { link as linkAsync, stat as statAsync } from 'node:fs/promises';
import { dirname } from 'node:path';

import makeDirSync from '@hexatool/fs-make-dir';
import makeDirAsync from '@hexatool/fs-make-dir/async';
import pathExistsSync from '@hexatool/fs-path-exists';
import pathExistsAsync from '@hexatool/fs-path-exists/async';
import { areIdentical } from '@hexatool/fs-stat';

export async function createLinkAsync(srcPath: string, destPath: string): Promise<void> {
	let destPathStats: Stats | undefined;
	try {
		destPathStats = await statAsync(destPath);
	} catch {
		destPathStats = undefined;
	}
	let srcPathStats: Stats | undefined;
	try {
		srcPathStats = await statAsync(srcPath);
		if (destPathStats && areIdentical(srcPathStats, destPathStats)) {
			return;
		}
	} catch (e) {
		const err = e as Error;
		err.message = err.message.replace('lstat', 'ensureLink');
		throw err;
	}

	const dir = dirname(destPath);
	const dirExists = await pathExistsAsync(dir);
	if (dirExists) {
		await linkAsync(srcPath, destPath);

		return;
	}
	await makeDirAsync(dir);

	await linkAsync(srcPath, destPath);
}

export function createLinkSync(srcPath: string, destPath: string): void {
	let destPathStats: Stats | undefined;
	try {
		destPathStats = statSync(destPath);
	} catch {
		destPathStats = undefined;
	}
	let srcPathStats: Stats | undefined;
	try {
		srcPathStats = statSync(srcPath);
		if (destPathStats && areIdentical(srcPathStats, destPathStats)) {
			return;
		}
	} catch (e) {
		const err = e as Error;
		err.message = err.message.replace('lstat', 'ensureLink');
		throw err;
	}

	const dir = dirname(destPath);
	const dirExists = pathExistsSync(dir);
	if (dirExists) {
		linkSync(srcPath, destPath);

		return;
	}
	makeDirSync(dir);

	linkSync(srcPath, destPath);
}
