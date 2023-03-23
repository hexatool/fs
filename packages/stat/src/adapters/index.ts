import * as fs from 'node:fs';

export type StatAsynchronousMethod = typeof fs.promises.stat;
export type StatSynchronousMethod = typeof fs.statSync;

export type LStatAsynchronousMethod = typeof fs.promises.lstat;
export type LStatSynchronousMethod = typeof fs.lstatSync;

export interface StatFileSystemAdapter {
	lstat: LStatAsynchronousMethod;
	lstatSync: LStatSynchronousMethod;
	stat: StatAsynchronousMethod;
	statSync: StatSynchronousMethod;
}

const STAT_FILE_SYSTEM_ADAPTER: StatFileSystemAdapter = {
	lstat: fs.promises.lstat,
	lstatSync: fs.lstatSync,
	stat: fs.promises.stat,
	statSync: fs.statSync,
};

export function createStatFileSystemAdapter(
	methods?: Partial<StatFileSystemAdapter>
): StatFileSystemAdapter {
	if (methods === undefined) {
		return STAT_FILE_SYSTEM_ADAPTER;
	}

	return {
		...STAT_FILE_SYSTEM_ADAPTER,
		...methods,
	};
}
