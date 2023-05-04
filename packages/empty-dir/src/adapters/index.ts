import * as fs from 'node:fs';

import type { MakeDirFileSystemAdapter } from '@hexatool/fs-make-dir';
import { MAKE_DIR_FILE_SYSTEM_ADAPTER } from '@hexatool/fs-make-dir';
import type { RemoveFileFileSystemAdapter } from '@hexatool/fs-remove';
import { REMOVE_FILE_SYSTEM_ADAPTER } from '@hexatool/fs-remove';

export type ReadDirAsynchronousMethod = typeof fs.promises.readdir;
export type ReadDirSynchronousMethod = typeof fs.readdirSync;

interface FileSystemAdapter {
	readdir: ReadDirAsynchronousMethod;
	readdirSync: ReadDirSynchronousMethod;
}

export type EmptyDirFileSystemAdapter = FileSystemAdapter &
	MakeDirFileSystemAdapter &
	RemoveFileFileSystemAdapter;

export const CREATE_LINK_SYSTEM_ADAPTER: EmptyDirFileSystemAdapter = {
	...MAKE_DIR_FILE_SYSTEM_ADAPTER,
	...REMOVE_FILE_SYSTEM_ADAPTER,
	readdir: fs.promises.readdir,
	readdirSync: fs.readdirSync,
};

export function emptyDirFileSystemAdapter(
	methods?: Partial<EmptyDirFileSystemAdapter>
): EmptyDirFileSystemAdapter {
	if (methods === undefined) {
		return CREATE_LINK_SYSTEM_ADAPTER;
	}

	return {
		...CREATE_LINK_SYSTEM_ADAPTER,
		...methods,
	};
}
