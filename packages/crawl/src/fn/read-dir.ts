import type { Dirent } from 'node:fs';

import { fs } from '@hexatool/fs-file-system';

import type { CallBack, CrawlerOptions } from '../types';
import excludeFn from './exclude';
import filterFn from './filter';

export type CallbackReadDirFn<Output extends Dirent | string> = (
	path: string,
	callback?: CallBack<Output[]>
) => void;
export type SyncReadDirFn<Output extends Dirent | string> = (path: string) => Output[];
export type ReadDirFn<Output extends Dirent | string> =
	| CallbackReadDirFn<Output>
	| SyncReadDirFn<Output>;

const callBackDirentReadFn: CallbackReadDirFn<Dirent> = (path, callback) =>
	callback && fs.readdir(path, { withFileTypes: true }, callback);
const syncDirentReadFn: SyncReadDirFn<Dirent> = path =>
	fs.readdirSync(path, { withFileTypes: true });

export default function readDirFn(
	api: 'callback',
	options: CrawlerOptions
): CallbackReadDirFn<Dirent>;
export default function readDirFn(api: 'sync', options: CrawlerOptions): SyncReadDirFn<Dirent>;
export default function readDirFn(
	api: 'callback' | 'sync',
	options: CrawlerOptions
): ReadDirFn<Dirent> {
	if (api === 'callback') {
		return filterFn(
			excludeFn(callBackDirentReadFn, options.exclude),
			options.excludeDirectories,
			options.excludeFiles
		);
	}

	return filterFn(
		excludeFn(syncDirentReadFn, options.exclude),
		options.excludeDirectories,
		options.excludeFiles
	);
}
