import type { Stats } from 'node:fs';
import fs from 'node:fs';

import { rmdir, rmdirSync } from './rmdir';
import type { ErrorWithCode } from './types';

export async function fixWindowsEPERM(path: string, er: Error): Promise<void> {
	try {
		await fs.promises.chmod(path, 0o666);
	} catch (e: unknown) {
		const err = e as ErrorWithCode;
		if (err.code === 'ENOENT') {
			return;
		}
		throw er;
	}

	let stats: Stats;

	try {
		stats = await fs.promises.stat(path);
	} catch (e: unknown) {
		const err = e as ErrorWithCode;
		if (err.code === 'ENOENT') {
			return;
		}
		throw er;
	}

	if (stats.isDirectory()) {
		await rmdir(path, er);
	} else {
		await fs.promises.unlink(path);
	}
}

export function fixWindowsEPERMSync(path: string, er: Error): void {
	try {
		fs.chmodSync(path, 0o666);
	} catch (e: unknown) {
		const err = e as ErrorWithCode;
		if (err.code === 'ENOENT') {
			return;
		}
		throw er;
	}

	let stats: Stats;

	try {
		stats = fs.statSync(path);
	} catch (e: unknown) {
		const err = e as ErrorWithCode;
		if (err.code === 'ENOENT') {
			return;
		}
		throw er;
	}

	if (stats.isDirectory()) {
		rmdirSync(path, er);
	} else {
		fs.unlinkSync(path);
	}
}
