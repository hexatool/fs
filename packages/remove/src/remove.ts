import { fs } from '@hexatool/fs-file-system';

import { rimraf, rimrafSync } from './rimraf';

export async function removeAsync(path: string): Promise<void> {
	// Node 14.14.0+
	/* eslint @typescript-eslint/no-unnecessary-condition: off */
	if (fs.promises.rm) {
		await fs.promises.rm(path, { recursive: true, force: true });

		return;
	}
	await rimraf(path);
}

export function removeSync(path: string): void {
	// Node 14.14.0+
	/* eslint @typescript-eslint/no-unnecessary-condition: off */
	if (fs.rmSync) {
		fs.rmSync(path, { recursive: true, force: true });

		return;
	}
	rimrafSync(path);
}
