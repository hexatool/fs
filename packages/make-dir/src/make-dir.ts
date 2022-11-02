import type { Mode } from 'node:fs';
import fs from 'node:fs';

import checkPath from './check-path';

export async function makeDir(path: string, mode: Mode = 0o777): Promise<string | undefined> {
	checkPath(path);

	return await fs.promises.mkdir(path, {
		mode,
		recursive: true,
	});
}

export function makeDirSync(path: string, mode: Mode = 0o777): string | undefined {
	checkPath(path);

	return fs.mkdirSync(path, {
		mode,
		recursive: true,
	});
}
