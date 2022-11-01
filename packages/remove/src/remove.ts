import fs from 'graceful-fs';
import { rimraf, rimrafSync } from './rimraf';

export async function remove(path: string) {
	// Node 14.14.0+
	if (fs.promises?.rm) return await fs.promises.rm(path, {recursive: true, force: true});
	return await rimraf(path);
}

export function removeSync(path: string) {
	// Node 14.14.0+
	if (fs.rmSync) return fs.rmSync(path, {recursive: true, force: true});
	rimrafSync(path);
}
