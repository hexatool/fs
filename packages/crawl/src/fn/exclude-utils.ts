import type { Dirent } from 'node:fs';

import type { CallBack } from '../types';
import type { ExcludePathFn, ExcludeType } from '../types/options';
import type { ReadDirFn } from './read-dir';

export const emptyReaDir: ReadDirFn<Dirent> = (
	_path: string,
	callback?: CallBack<Dirent[]>
): Dirent[] | undefined => {
	if (callback) {
		callback(null, []);

		return;
	}

	return [];
};

export type ExcludeFn<Exclude extends ExcludeType> = (path: string, exclude: Exclude) => boolean;

export function matchExclude<Exclude extends ExcludeType>(ex: Exclude): ExcludeFn<Exclude> {
	if (typeof ex === 'string') {
		return matchExcludeString as ExcludeFn<Exclude>;
	}
	if (typeof ex === 'function') {
		return matchExcludeFn as ExcludeFn<Exclude>;
	}

	return matchExcludeRegex as ExcludeFn<Exclude>;
}

function matchExcludeRegex(path: string, regex: RegExp): boolean {
	return regex.test(path);
}

function matchExcludeString(path: string, term: string): boolean {
	return path === term;
}

function matchExcludeFn(path: string, fn: ExcludePathFn): boolean {
	return fn(path);
}
