import fs from 'graceful-fs';
import type {Stats} from 'graceful-fs';
import { fixWindowsEPERM, fixWindowsEPERMSync } from './fix-windows-eperm';
import isWindows  from './is-windows';
import { rmdirSync, rmdir } from './rmdir';

export async function rimraf(path: string) {
	let st: Stats | undefined = undefined;

	try {
		st = await fs.promises.lstat(path);
	} catch (err: any) {
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
			await rmdir(path, null)
		} else {
			await fs.promises.unlink(path)
		}
	} catch (er: any) {
		if (er.code === 'ENOENT') {
			return
		} else if (er.code === 'EPERM') {
			return isWindows ? await fixWindowsEPERM(path, er) : await rmdir(path, er)
		} else if (er.code !== 'EISDIR') {
			throw er
		}
		await rmdir(path, er)
	}
}

export function rimrafSync(path: string) {
	let st: Stats | undefined = undefined;

	try {
		st = fs.lstatSync(path);
	} catch (err: any) {
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
			rmdirSync(path, null)
		} else {
			fs.unlinkSync(path)
		}
	} catch (er: any) {
		if (er.code === 'ENOENT') {
			return
		} else if (er.code === 'EPERM') {
			return isWindows ? fixWindowsEPERMSync(path, er) : rmdirSync(path, er)
		} else if (er.code !== 'EISDIR') {
			throw er
		}
		rmdirSync(path, er)
	}
}
