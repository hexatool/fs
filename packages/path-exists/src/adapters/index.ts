import * as fs from 'node:fs';

import type { PathLike } from 'fs';

export type PathExistsAsynchronousMethod = (path: PathLike) => Promise<boolean>;
export type PathExistsSynchronousMethod = (path: PathLike) => boolean;

export interface PathExistsFileSystemAdapter {
	pathExists: PathExistsAsynchronousMethod;
	pathExistsSync: PathExistsSynchronousMethod;
}

export const PATH_EXISTS_FILE_SYSTEM_ADAPTER: PathExistsFileSystemAdapter = {
	pathExists: path =>
		fs.promises
			.access(path)
			.then(() => true)
			.catch(() => false),
	pathExistsSync: fs.existsSync,
};

export function createPathExistsFileSystemAdapter(
	methods?: Partial<PathExistsFileSystemAdapter>
): PathExistsFileSystemAdapter {
	if (methods === undefined) {
		return PATH_EXISTS_FILE_SYSTEM_ADAPTER;
	}

	return {
		...PATH_EXISTS_FILE_SYSTEM_ADAPTER,
		...methods,
	};
}
