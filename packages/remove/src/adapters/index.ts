import * as fs from 'node:fs';

export type RmAsynchronousMethod = typeof fs.promises.rm;
export type RmSynchronousMethod = typeof fs.rmSync;

export interface RemoveFileFileSystemAdapter {
	rm: RmAsynchronousMethod;
	rmSync: RmSynchronousMethod;
}

export const REMOVE_FILE_SYSTEM_ADAPTER: RemoveFileFileSystemAdapter = {
	rm: fs.promises.rm,
	rmSync: fs.rmSync,
};

export function createRemoveFileSystemAdapter(
	methods?: Partial<RemoveFileFileSystemAdapter>
): RemoveFileFileSystemAdapter {
	if (methods === undefined) {
		return REMOVE_FILE_SYSTEM_ADAPTER;
	}

	return {
		...REMOVE_FILE_SYSTEM_ADAPTER,
		...methods,
	};
}
