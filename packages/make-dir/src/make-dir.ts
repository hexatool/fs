import type { Mode } from 'node:fs';

import { fs } from '@hexatool/fs-file-system';

import checkPath from './check-path';

export async function makeDirAsync(path: string, mode: Mode = 0o777): Promise<void> {
	checkPath(path);

	await fs.promises.mkdir(path, {
		mode,
		recursive: true,
	});
}

export function makeDirSync(path: string, mode: Mode = 0o777): void {
	checkPath(path);

	fs.mkdirSync(path, {
		mode,
		recursive: true,
	});
}
