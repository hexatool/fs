import type { Dirent } from 'node:fs';

import type { ExcludeType } from '../types/options';
import { emptyReaDir, matchExclude } from './exclude-utils';
import type { ReadDirFn } from './read-dir';

export default function excludeFn<Exclude extends ExcludeType, Fn extends ReadDirFn<Dirent>>(
	readDir: Fn,
	exclude?: Exclude
): Fn {
	if (!exclude) {
		return readDir;
	}
	const excludeFn = matchExclude(exclude);

	return ((path: string, callback) => {
		if (!excludeFn(path, exclude)) {
			return readDir(path, callback);
		}

		return emptyReaDir(path, callback);
	}) as Fn;
}
