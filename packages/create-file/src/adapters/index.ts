import * as fs from 'node:fs';

import type { MakeDirFileSystemAdapter } from '@hexatool/fs-make-dir';
import { MAKE_DIR_FILE_SYSTEM_ADAPTER } from '@hexatool/fs-make-dir';
import type { StatFileSystemAdapter } from '@hexatool/fs-stat';
import { STAT_FILE_SYSTEM_ADAPTER } from '@hexatool/fs-stat';

export type CreateFileAsynchronousMethod = typeof fs.promises.writeFile;
export type CreateFileSynchronousMethod = typeof fs.writeFileSync;

interface FileSystemAdapter {
	createFile: CreateFileAsynchronousMethod;
	createFileSync: CreateFileSynchronousMethod;
}

export type CreateFileFileSystemAdapter = FileSystemAdapter &
	MakeDirFileSystemAdapter &
	StatFileSystemAdapter;

export const CREATE_FILE_FILE_SYSTEM_ADAPTER: CreateFileFileSystemAdapter = {
	...MAKE_DIR_FILE_SYSTEM_ADAPTER,
	...STAT_FILE_SYSTEM_ADAPTER,
	createFile: fs.promises.writeFile,
	createFileSync: fs.writeFileSync,
};

export function createCreateFileFileSystemAdapter(
	methods?: Partial<CreateFileFileSystemAdapter>
): CreateFileFileSystemAdapter {
	if (methods === undefined) {
		return CREATE_FILE_FILE_SYSTEM_ADAPTER;
	}

	return {
		...CREATE_FILE_FILE_SYSTEM_ADAPTER,
		...methods,
	};
}
