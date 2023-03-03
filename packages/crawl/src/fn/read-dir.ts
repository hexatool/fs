import type { Dirent } from 'node:fs';

import { fs } from '@hexatool/fs-file-system';
import type { PathLike } from 'fs';

import type { CallBack, ReturnType } from '../types';

export type CallbackReadDirFn<Output extends Dirent | string> = (
	path: PathLike,
	callback: CallBack<Output[]>
) => void;
export type SyncReadDirFn<Output extends Dirent | string> = (path: PathLike) => Output[];
export type ReadDirFn<Output extends Dirent | string> =
	| CallbackReadDirFn<Output>
	| SyncReadDirFn<Output>;

const callBackDirentReadFn: CallbackReadDirFn<Dirent> = (path, callback) =>
	fs.readdir(path, { withFileTypes: true }, callback);
const syncDirentReadFn: SyncReadDirFn<Dirent> = path =>
	fs.readdirSync(path, { withFileTypes: true });
const callBackReadFn: CallbackReadDirFn<string> = (path, callback) => fs.readdir(path, callback);

const syncReadFn: SyncReadDirFn<string> = path => fs.readdirSync(path);

export default function readDirFn(api: 'callback', resultType: 'Dirent'): CallbackReadDirFn<Dirent>;
export default function readDirFn(api: 'callback', resultType: 'string'): CallbackReadDirFn<string>;
export default function readDirFn(api: 'sync', resultType: 'Dirent'): SyncReadDirFn<Dirent>;
export default function readDirFn(api: 'sync', resultType: 'string'): SyncReadDirFn<string>;
export default function readDirFn<Output extends Dirent | string>(
	api: 'callback' | 'sync',
	resultType: ReturnType
): ReadDirFn<Output> {
	if (api === 'callback' && resultType === 'Dirent') {
		// @ts-ignore
		return callBackDirentReadFn;
	}
	if (api === 'sync' && resultType === 'Dirent') {
		return syncDirentReadFn;
	}
	if (api === 'callback' && resultType === 'string') {
		// @ts-ignore
		return callBackReadFn;
	}

	return syncReadFn;
}
