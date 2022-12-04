import type { Stats } from 'node:fs';

import { fs } from '@hexatool/fs-file-system';

import { fixWindowsEPERM, fixWindowsEPERMSync } from './fix-windows-eperm';
import isWindows from './is-windows';
import { rmdir, rmdirSync } from './rmdir';
import type { ErrorWithCode } from './types';

export async function rimraf(path: string): Promise<void> {
	let st: Stats | undefined = undefined;

	try {
		st = await fs.promises.lstat(path);
	} catch (e: unknown) {
		const err = e as ErrorWithCode;
		if (err.code === 'ENOENT') {
			return;
		}

		// Windows can EPERM on stat.  Life is suffering.
		if (err.code === 'EPERM' && isWindows) {
			await fixWindowsEPERM(path, err);
		}
	}

	try {
		// sunos lets the root user unlink directories, which is... weird.
		if (st && st.isDirectory()) {
			await rmdir(path);
		} else {
			await fs.promises.unlink(path);
		}
	} catch (e2: unknown) {
		const err2 = e2 as ErrorWithCode;
		if (err2.code === 'ENOENT') {
			return;
		}
		if (err2.code === 'EPERM') {
			isWindows ? await fixWindowsEPERM(path, err2) : await rmdir(path, err2);

			return;
		}
		if (err2.code !== 'EISDIR') {
			throw err2;
		}
		await rmdir(path, err2);
	}
}

export function rimrafSync(path: string): void {
	let st: Stats | undefined = undefined;

	try {
		st = fs.lstatSync(path);
	} catch (e: unknown) {
		const err = e as ErrorWithCode;
		if (err.code === 'ENOENT') {
			return;
		}

		// Windows can EPERM on stat.  Life is suffering.
		if (err.code === 'EPERM' && isWindows) {
			fixWindowsEPERMSync(path, err);
		}
	}

	try {
		// sunos lets the root user unlink directories, which is... weird.
		if (st && st.isDirectory()) {
			rmdirSync(path);
		} else {
			fs.unlinkSync(path);
		}
	} catch (e2: unknown) {
		const err2 = e2 as ErrorWithCode;
		if (err2.code === 'ENOENT') {
			return;
		}
		if (err2.code === 'EPERM') {
			isWindows ? fixWindowsEPERMSync(path, err2) : rmdirSync(path, err2);

			return;
		}
		if (err2.code !== 'EISDIR') {
			throw err2;
		}
		rmdirSync(path, err2);
	}
}
