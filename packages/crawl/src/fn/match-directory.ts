import type { ExcludeStringPathFn, ExcludeType } from '../types/options';

type ExcludeFn = (path: string) => boolean;

export default function matchDirectory<Exclude extends ExcludeType>(ex: Exclude): ExcludeFn {
	if (typeof ex === 'string') {
		return matchExcludeString(ex);
	}
	if (typeof ex === 'function') {
		return matchExcludeFn(ex);
	}

	return matchExcludeRegex(ex);
}

function matchExcludeRegex(exclude: RegExp): ExcludeFn {
	return path => exclude.test(path);
}

function matchExcludeString(exclude: string): ExcludeFn {
	return path => path === exclude;
}

function matchExcludeFn(exclude: ExcludeStringPathFn): ExcludeFn {
	return path => exclude(path);
}
