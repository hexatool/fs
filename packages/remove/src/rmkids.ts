import fs from 'graceful-fs';
import { join } from 'node:path';
import isWindows from './is-windows';
import { rimraf, rimrafSync } from './rimraf';

export function rmkidsSync(path: string) {
	fs.readdirSync(path).forEach(f => rimrafSync(join(path, f)));
	if (isWindows) {
		// We only end up here once we got ENOTEMPTY at least once, and
		// at this point, we are guaranteed to have removed all the kids.
		// So, we know that it won't be ENOENT or ENOTDIR or anything else.
		// try really hard to delete stuff on windows, because it has a
		// PROFOUNDLY annoying habit of not closing handles promptly when
		// files are deleted, resulting in spurious ENOTEMPTY errors.
		const startTime = Date.now();
		do {
			try {
				return fs.rmdirSync(path);
			} catch {
			}
		} while (Date.now() - startTime < 500); // give up after 500ms
	} else {
		return fs.rmdirSync(path);
	}
}


export async function rmkids(path: string) {
	const files = await fs.promises.readdir(path);
	await Promise.all(files.map(f => rimraf(join(path, f))));
	if (isWindows) {
		// We only end up here once we got ENOTEMPTY at least once, and
		// at this point, we are guaranteed to have removed all the kids.
		// So, we know that it won't be ENOENT or ENOTDIR or anything else.
		// try really hard to delete stuff on windows, because it has a
		// PROFOUNDLY annoying habit of not closing handles promptly when
		// files are deleted, resulting in spurious ENOTEMPTY errors.
		const startTime = Date.now();
		do {
			try {
				return await fs.promises.rmdir(path);
			} catch {
			}
		} while (Date.now() - startTime < 500); // give up after 500ms
	} else {
		return await fs.promises.rmdir(path);
	}
}
