import type { Dirent } from 'node:fs';

import type { CrawlerOptions } from '../types';
import { emptyReaDir, matchExclude } from './exclude-utils';
import type { ReadDirFn } from './read-dir';

export default function excludeFn<Fn extends ReadDirFn<Dirent>>(
	readDir: Fn,
	{ exclude }: CrawlerOptions
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
