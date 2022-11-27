import { fs } from '@hexatool/fs-file-system';
import makeDirSync from '@hexatool/fs-make-dir';
import makeDirAsync from '@hexatool/fs-make-dir/async';
import type { Stats } from 'node:fs';
import { dirname } from 'node:path';

type ErrorWithCode = Error & {
	code?: string;
};

export async function createFileAsync(path: string): Promise<void> {
	let stats: Stats | undefined;
	try {
		stats = await fs.promises.stat(path);
	} catch {
		stats = undefined;
	}
	if (stats && stats.isFile()) {
		return;
	}

	const dir = dirname(path);
	try {
		const dirStat = await fs.promises.stat(dir);
		if (!dirStat.isDirectory()) {
			// parent is not a directory
			// This is just to cause an internal ENOTDIR error to be thrown
			await fs.promises.readdir(dir);
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

	await fs.promises.writeFile(path, '');
}

export function createFileSync(path: string): void {
	let stats: Stats | undefined;
	try {
		stats = fs.statSync(path);
	} catch {
		stats = undefined;
	}
	if (stats && stats.isFile()) {
		return;
	}

	const dir = dirname(path);
	try {
		if (!fs.statSync(dir).isDirectory()) {
			// parent is not a directory
			// This is just to cause an internal ENOTDIR error to be thrown
			fs.readdirSync(dir);
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

	fs.writeFileSync(path, '');
}
