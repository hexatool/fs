import { fs } from '@hexatool/fs-file-system';

export type MkdirAsynchronousMethod = typeof fs.promises.mkdir;
export type MkdirSynchronousMethod = typeof fs.mkdirSync;

export interface MakeDirFileSystemAdapter {
	mkdir: MkdirAsynchronousMethod;
	mkdirSync: MkdirSynchronousMethod;
}

const MAKE_DIR_FILE_SYSTEM_ADAPTER: MakeDirFileSystemAdapter = {
	mkdir: fs.promises.mkdir,
	mkdirSync: fs.mkdirSync,
};

export function createMakeDirFileSystemAdapter(
	methods?: Partial<MakeDirFileSystemAdapter>
): MakeDirFileSystemAdapter {
	if (methods === undefined) {
		return MAKE_DIR_FILE_SYSTEM_ADAPTER;
	}

	return {
		...MAKE_DIR_FILE_SYSTEM_ADAPTER,
		...methods,
	};
}
