import type { Stats } from 'node:fs';
import { readdirSync as readDirSync, statSync, writeFileSync } from 'node:fs';
import {
	readdir as readDirAsync,
	stat as statAsync,
	writeFile as writeFileAsync,
} from 'node:fs/promises';
import { dirname } from 'node:path';

import makeDirSync from '@hexatool/fs-make-dir';
import makeDirAsync from '@hexatool/fs-make-dir/async';

type ErrorWithCode = Error & {
	code?: string;
};

export async function createFileAsync(path: string): Promise<void> {
	let stats: Stats | undefined;
	try {
		stats = await statAsync(path);
	} catch {
		stats = undefined;
	}
	if (stats && stats.isFile()) {
		return;
	}

	const dir = dirname(path);
	try {
		const dirStat = await statAsync(dir);
		if (!dirStat.isDirectory()) {
			// parent is not a directory
			// This is just to cause an internal ENOTDIR error to be thrown
			await readDirAsync(dir);
		}
	} catch (e) {
		const err = e as ErrorWithCode;
		// If the stat call above failed because the directory doesn't exist, create it
		if (err.code === 'ENOENT') {
			await makeDirAsync(dir);
		} else {
			throw err;
		}
	}

	await writeFileAsync(path, '');
}

export function createFileSync(path: string): void {
	let stats: Stats | undefined;
	try {
		stats = statSync(path);
	} catch {
		stats = undefined;
	}
	if (stats && stats.isFile()) {
		return;
	}

	const dir = dirname(path);
	try {
		if (!statSync(dir).isDirectory()) {
			// parent is not a directory
			// This is just to cause an internal ENOTDIR error to be thrown
			readDirSync(dir);
		}
	} catch (e) {
		const err = e as ErrorWithCode;
		// If the stat call above failed because the directory doesn't exist, create it
		if (err.code === 'ENOENT') {
			makeDirSync(dir);
		} else {
			throw err;
		}
	}

	writeFileSync(path, '');
}
