import type { Dirent } from 'node:fs';

import { fs } from '@hexatool/fs-file-system';

import type { CallBack, ResultType } from '../types';
import type { ExcludePathFn, ExcludeType } from '../types/options';

export type CallbackReadDirFn<Output extends Dirent | string> = (
	path: string,
	callback: CallBack<Output[]>
) => void;
export type SyncReadDirFn<Output extends Dirent | string> = (path: string) => Output[];
export type ReadDirFn<Output extends Dirent | string> =
	| CallbackReadDirFn<Output>
	| SyncReadDirFn<Output>;

const callBackDirentReadFn: CallbackReadDirFn<Dirent> = (path, callback) =>
	fs.readdir(path, { withFileTypes: true }, callback);
const syncDirentReadFn: SyncReadDirFn<Dirent> = path =>
	fs.readdirSync(path, { withFileTypes: true });
const callBackReadFn: CallbackReadDirFn<string> = (path, callback) => fs.readdir(path, callback);

const syncReadFn: SyncReadDirFn<string> = path => fs.readdirSync(path);

function matchExcludeRegex(path: string, regex: RegExp): boolean {
	return regex.test(path);
}

function matchExcludeString(path: string, term: string): boolean {
	return path === term;
}

function matchExcludeFn(path: string, fn: ExcludePathFn): boolean {
	return fn(path);
}

type ExcludeFn<Exclude extends ExcludeType> = (path: string, exclude: Exclude) => boolean;

function matchExclude<Exclude extends ExcludeType>(ex: Exclude): ExcludeFn<Exclude> {
	if (typeof ex === 'string') {
		return matchExcludeString as ExcludeFn<Exclude>;
	}
	if (typeof ex === 'function') {
		return matchExcludeFn as ExcludeFn<Exclude>;
	}

	return matchExcludeRegex as ExcludeFn<Exclude>;
}

function excludeFn<
	Exclude extends ExcludeType,
	Output extends Dirent | string,
	Fn extends ReadDirFn<Output>
>(readDir: Fn, exclude?: Exclude): Fn {
	if (!exclude) {
		return readDir;
	}
	const excludeFn = matchExclude(exclude);

	return ((path: string, callback) => {
		if (!excludeFn(path, exclude)) {
			return readDir(path, callback);
		}
		if (callback) {
			callback(null, []);
		} else {
			return [];
		}
	}) as Fn;
}

export default function readDirFn(
	api: 'callback',
	resultType: 'Dirent',
	exclude?: ExcludeType
): CallbackReadDirFn<Dirent>;
export default function readDirFn(
	api: 'callback',
	resultType: 'string',
	exclude?: ExcludeType
): CallbackReadDirFn<string>;
export default function readDirFn(
	api: 'sync',
	resultType: 'Dirent',
	exclude?: ExcludeType
): SyncReadDirFn<Dirent>;
export default function readDirFn(
	api: 'sync',
	resultType: 'string',
	exclude?: ExcludeType
): SyncReadDirFn<string>;
export default function readDirFn<Output extends Dirent | string>(
	api: 'callback' | 'sync',
	resultType: ResultType,
	exclude?: ExcludeType
): ReadDirFn<Output> {
	if (api === 'callback' && resultType === 'Dirent') {
		return excludeFn(callBackDirentReadFn, exclude) as CallbackReadDirFn<Output>;
	}
	if (api === 'sync' && resultType === 'Dirent') {
		return excludeFn(syncDirentReadFn, exclude);
	}
	if (api === 'callback' && resultType === 'string') {
		return excludeFn(callBackReadFn, exclude) as CallbackReadDirFn<Output>;
	}

	return excludeFn(syncReadFn, exclude);
}
