import type { Stats } from 'node:fs';
import { dirname } from 'node:path';

import { fs } from '@hexatool/fs-file-system';
import makeDirSync from '@hexatool/fs-make-dir';
import makeDirAsync from '@hexatool/fs-make-dir/async';
import pathExistsSync from '@hexatool/fs-path-exists';
import pathExistsAsync from '@hexatool/fs-path-exists/async';
import { areIdentical } from '@hexatool/fs-stat';

export async function createLinkAsync(srcPath: string, destPath: string): Promise<void> {
	let destPathStats: Stats | undefined;
	try {
		destPathStats = await fs.promises.stat(destPath);
	} catch {
		destPathStats = undefined;
	}
	let srcPathStats: Stats | undefined;
	try {
		srcPathStats = await fs.promises.stat(srcPath);
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
		await fs.promises.link(srcPath, destPath);

		return;
	}
	await makeDirAsync(dir);

	await fs.promises.link(srcPath, destPath);
}

export function createLinkSync(srcPath: string, destPath: string): void {
	let destPathStats: Stats | undefined;
	try {
		destPathStats = fs.statSync(destPath);
	} catch {
		destPathStats = undefined;
	}
	let srcPathStats: Stats | undefined;
	try {
		srcPathStats = fs.statSync(srcPath);
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
		fs.linkSync(srcPath, destPath);

		return;
	}
	makeDirSync(dir);

	fs.linkSync(srcPath, destPath);
}
