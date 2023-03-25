import type { Stats } from 'node:fs';
import { dirname } from 'node:path';

import makeDirSync from '@hexatool/fs-make-dir';
import makeDirAsync from '@hexatool/fs-make-dir/async';
import statSync from '@hexatool/fs-stat';
import statAsync from '@hexatool/fs-stat/async';

import type { CreateFileOptionsOrSettings } from './settings';
import { CreateFileSettings } from './settings';
import { ErrorWithCode } from './types';

export async function createFileAsync(
	path: string,
	optionsOrSettings?: CreateFileOptionsOrSettings
): Promise<void> {
	const { fs } = CreateFileSettings.getSettings(optionsOrSettings);
	let stats: Stats | undefined;
	try {
		stats = await statAsync(path, {
			fs,
			throwErrorOnBrokenSymbolicLink: true,
			followSymbolicLink: false,
		});
	} catch {
		stats = undefined;
	}
	if (stats && stats.isFile()) {
		return;
	}

	const dir = dirname(path);
	try {
		stats = await statAsync(dir, {
			fs,
			throwErrorOnBrokenSymbolicLink: true,
			followSymbolicLink: false,
		});
		if (!stats.isDirectory()) {
			throw new ErrorWithCode('ENOTDIR', `not a directory, scandir '${dir}'`);
		}
	} catch (e) {
		const err = e as ErrorWithCode;
		// If the stat call above failed because the directory doesn't exist, create it
		if (err.code === 'ENOENT') {
			await makeDirAsync(dir, { fs });
		} else {
			throw err;
		}
	}

	await fs.createFile(path, '');
}

export function createFileSync(
	path: string,
	optionsOrSettings?: CreateFileOptionsOrSettings
): void {
	const { fs } = CreateFileSettings.getSettings(optionsOrSettings);
	let stats: Stats | undefined;
	try {
		stats = statSync(path, {
			fs,
			throwErrorOnBrokenSymbolicLink: true,
			followSymbolicLink: false,
		});
	} catch {
		stats = undefined;
	}
	if (stats && stats.isFile()) {
		return;
	}

	const dir = dirname(path);
	try {
		stats = statSync(dir, {
			fs,
			throwErrorOnBrokenSymbolicLink: true,
			followSymbolicLink: false,
		});
		if (!stats.isDirectory()) {
			throw new ErrorWithCode('ENOTDIR', `not a directory, scandir '${dir}'`);
		}
	} catch (e) {
		const err = e as ErrorWithCode;
		// If the stat call above failed because the directory doesn't exist, create it
		if (err.code === 'ENOENT') {
			makeDirSync(dir, { fs });
		} else {
			throw err;
		}
	}

	fs.createFileSync(path, '');
}
