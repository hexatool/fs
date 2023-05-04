import type { Stats } from 'node:fs';
import { dirname } from 'node:path';

import makeDirSync from '@hexatool/fs-make-dir';
import makeDirAsync from '@hexatool/fs-make-dir/async';
import pathExistsSync from '@hexatool/fs-path-exists';
import pathExistsAsync from '@hexatool/fs-path-exists/async';
import statSync, { areIdentical } from '@hexatool/fs-stat';
import statAsync from '@hexatool/fs-stat/async';

import type { CreateLinkOptionsOrSettings } from './settings';
import { CreateLinkSettings } from './settings';

export async function createLinkAsync(
	srcPath: string,
	destPath: string,
	optionsOrSettings: CreateLinkOptionsOrSettings = {}
): Promise<void> {
	const { fs } = CreateLinkSettings.getSettings(optionsOrSettings);
	let destPathStats: Stats | undefined;
	try {
		destPathStats = await statAsync(destPath, { fs });
	} catch {
		destPathStats = undefined;
	}
	let srcPathStats: Stats | undefined;
	try {
		srcPathStats = await statAsync(srcPath, { fs });
		if (destPathStats && areIdentical(srcPathStats, destPathStats)) {
			return;
		}
	} catch (e) {
		const err = e as Error;
		err.message = err.message.replace('lstat', 'ensureLink');
		throw err;
	}

	const dir = dirname(destPath);
	const dirExists = await pathExistsAsync(dir, { fs });
	if (dirExists) {
		await fs.link(srcPath, destPath);

		return;
	}
	await makeDirAsync(dir, { fs });

	await fs.link(srcPath, destPath);
}

export function createLinkSync(
	srcPath: string,
	destPath: string,
	optionsOrSettings: CreateLinkOptionsOrSettings = {}
): void {
	const { fs } = CreateLinkSettings.getSettings(optionsOrSettings);
	let destPathStats: Stats | undefined;
	try {
		destPathStats = statSync(destPath, { fs });
	} catch {
		destPathStats = undefined;
	}
	let srcPathStats: Stats | undefined;
	try {
		srcPathStats = statSync(srcPath, { fs });
		if (destPathStats && areIdentical(srcPathStats, destPathStats)) {
			return;
		}
	} catch (e) {
		const err = e as Error;
		err.message = err.message.replace('lstat', 'ensureLink');
		throw err;
	}

	const dir = dirname(destPath);
	const dirExists = pathExistsSync(dir, { fs });
	if (dirExists) {
		fs.linkSync(srcPath, destPath);

		return;
	}
	makeDirSync(dir, { fs });

	fs.linkSync(srcPath, destPath);
}
