import type { Dirent } from 'node:fs';

import type { ExcludePathFn, ExcludeType } from '../types/options';
import type { ReadDirFn } from './read-dir';

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

export default function excludeFn<Exclude extends ExcludeType, Fn extends ReadDirFn<Dirent>>(
	readDir: Fn,
	exclude?: Exclude
): Fn {
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
