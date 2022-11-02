import { join } from 'node:path';

import fs from 'graceful-fs';

import isWindows from './is-windows';
import { rimraf, rimrafSync } from './rimraf';

export function rmkidsSync(path: string): void {
	fs.readdirSync(path).forEach(f => {
		rimrafSync(join(path, f));
	});
	if (isWindows) {
		// We only end up here once we got ENOTEMPTY at least once, and
		// at this point, we are guaranteed to have removed all the kids.
		// So, we know that it won't be ENOENT or ENOTDIR or anything else.
		// try really hard to delete stuff on Windows, because it has a
		// PROFOUNDLY annoying habit of not closing handles promptly when
		// files are deleted, resulting in spurious ENOTEMPTY errors.
		const startTime = Date.now();
		do {
			try {
				fs.rmdirSync(path);

				return;
			} catch {
				// ignore
			}
		} while (Date.now() - startTime < 500); // give up after 500ms
	} else {
		fs.rmdirSync(path);
	}

	return;
}

export async function rmkids(path: string): Promise<void> {
	const files = await fs.promises.readdir(path);
	await Promise.all(files.map(f => rimraf(join(path, f))));
	if (isWindows) {
		// We only end up here once we got ENOTEMPTY at least once, and
		// at this point, we are guaranteed to have removed all the kids.
		// So, we know that it won't be ENOENT or ENOTDIR or anything else.
		// try really hard to delete stuff on Windows, because it has a
		// PROFOUNDLY annoying habit of not closing handles promptly when
		// files are deleted, resulting in spurious ENOTEMPTY errors.
		const startTime = Date.now();
		do {
			try {
				/* eslint no-await-in-loop: warn */
				await fs.promises.rmdir(path);

				return;
			} catch {
				// ignore
			}
		} while (Date.now() - startTime < 500); // give up after 500ms
	} else {
		await fs.promises.rmdir(path);

		return;
	}
}
