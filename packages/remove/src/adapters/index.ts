import { fs } from '@hexatool/fs-file-system';

export type RmAsynchronousMethod = typeof fs.promises.rm;
export type RmSynchronousMethod = typeof fs.rmSync;

export interface FileSystemAdapter {
	rm: RmAsynchronousMethod;
	rmSync: RmSynchronousMethod;
}

const REMOVE_FILE_SYSTEM_ADAPTER: FileSystemAdapter = {
	rm: fs.promises.rm,
	rmSync: fs.rmSync,
};

export function createRemoveFileSystemAdapter(
	methods?: Partial<FileSystemAdapter>
): FileSystemAdapter {
	if (methods === undefined) {
		return REMOVE_FILE_SYSTEM_ADAPTER;
	}

	return {
		...REMOVE_FILE_SYSTEM_ADAPTER,
		...methods,
	};
}
