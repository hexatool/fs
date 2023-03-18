import type { ExtendedDirent } from '../types';
import type {
	ExcludeItemPathFn,
	ExcludeItemType,
	ResultType,
	ResultTypeOutput,
} from '../types/options';

export type ExcludeFn = (parent: string, item: ResultTypeOutput) => boolean;

export default function matchItem<Exclude extends ExcludeItemType>(
	ex: Exclude,
	returnType: ResultType
): ExcludeFn {
	if (ex === true) {
		return () => true;
	}
	if (typeof ex === 'string') {
		return matchExcludeString(ex, returnType);
	}
	if (typeof ex === 'function') {
		return matchExcludeFn(ex);
	}

	return matchExcludeRegex(ex, returnType);
}

function matchExcludeRegex(exclude: RegExp, returnType: ResultType): ExcludeFn {
	if (returnType === 'string') {
		return (_p, item) => exclude.test(item as string);
	}

	return (_p, item) => exclude.test((item as ExtendedDirent).name);
}

function matchExcludeString(exclude: string, returnType: ResultType): ExcludeFn {
	if (returnType === 'string') {
		return (_p, item) => exclude === item;
	}

	return (_p, item) => (item as ExtendedDirent).name === item;
}

function matchExcludeFn(exclude: ExcludeItemPathFn): ExcludeFn {
	// @ts-ignore
	return (parent, item) => exclude(parent, item);
}
