import fs from 'graceful-fs';
import type { Mode } from 'graceful-fs';
import checkPath from './check-path';


export async function makeDir(path: string, mode: Mode = 0o777) {
	checkPath(path);
	return await fs.promises.mkdir(path, {
		mode,
		recursive: true,
	});

}

export function makeDirSync(path: string, mode: Mode = 0o777) {
	checkPath(path);
	return fs.mkdirSync(path, {
		mode,
		recursive: true,
	});
}
