import * as fs from 'node:fs';

import type { MakeDirFileSystemAdapter } from '@hexatool/fs-make-dir';
import { MAKE_DIR_FILE_SYSTEM_ADAPTER } from '@hexatool/fs-make-dir';
import type { PathExistsFileSystemAdapter } from '@hexatool/fs-path-exists';
import { PATH_EXISTS_FILE_SYSTEM_ADAPTER } from '@hexatool/fs-path-exists';
import type { StatFileSystemAdapter } from '@hexatool/fs-stat';
import { STAT_FILE_SYSTEM_ADAPTER } from '@hexatool/fs-stat';

export type CreateLinkAsynchronousMethod = typeof fs.promises.link;
export type CreateLinkSynchronousMethod = typeof fs.linkSync;

interface FileSystemAdapter {
	link: CreateLinkAsynchronousMethod;
	linkSync: CreateLinkSynchronousMethod;
}

export type CreateLinkFileSystemAdapter = FileSystemAdapter &
	MakeDirFileSystemAdapter &
	PathExistsFileSystemAdapter &
	StatFileSystemAdapter;

const CREATE_LINK_SYSTEM_ADAPTER: CreateLinkFileSystemAdapter = {
	...MAKE_DIR_FILE_SYSTEM_ADAPTER,
	...STAT_FILE_SYSTEM_ADAPTER,
	...PATH_EXISTS_FILE_SYSTEM_ADAPTER,
	link: fs.promises.link,
	linkSync: fs.linkSync,
};

export function createLinkFileSystemAdapter(
	methods?: Partial<CreateLinkFileSystemAdapter>
): CreateLinkFileSystemAdapter {
	if (methods === undefined) {
		return CREATE_LINK_SYSTEM_ADAPTER;
	}

	return {
		...CREATE_LINK_SYSTEM_ADAPTER,
		...methods,
	};
}
