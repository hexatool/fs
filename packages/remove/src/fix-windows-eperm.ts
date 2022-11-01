import type { Stats } from 'graceful-fs';
import fs from 'graceful-fs';
import { rmdirSync } from './rmdir';

export async function fixWindowsEPERM(path: string, er: any) {
	try {
		await fs.promises.chmod(path, 0o666);
	} catch (err: any) {
		if (err.code === 'ENOENT') {
			return;
		} else {
			throw er;
		}
	}

	let stats: Stats;

	try {
		stats = await fs.promises.stat(path);
	} catch (err: any) {
		if (err.code === 'ENOENT') {
			return;
		} else {
			throw er;
		}
	}

	if (stats.isDirectory()) {
		await fs.promises.rmdir(path, er);
	} else {
		await fs.promises.unlink(path);
	}
}

export function fixWindowsEPERMSync(path: string, er: any) {
	try {
		fs.chmodSync(path, 0o666);
	} catch (err: any) {
		if (err.code === 'ENOENT') {
			return;
		} else {
			throw er;
		}
	}

	let stats: Stats;

	try {
		stats = fs.statSync(path);
	} catch (err: any) {
		if (err.code === 'ENOENT') {
			return;
		} else {
			throw er;
		}
	}

	if (stats.isDirectory()) {
		rmdirSync(path, er);
	} else {
		fs.unlinkSync(path);
	}
}
