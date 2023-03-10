import path from 'node:path';

import type { PathType } from '../types/options';

export type FormatPathFn = (folder: string, file: string) => string;

const defaultFormatPath: FormatPathFn = (_f, file) => file;
const absoluteFormatPath: FormatPathFn = (folder, file) => path.resolve(folder, file);
const relativeFormatPath: FormatPathFn = (folder, file) => path.relative(folder, file);

export default function formatPath(path?: PathType): FormatPathFn {
	if (path === 'relative') {
		return relativeFormatPath;
	}
	if (path === 'absolute') {
		return absoluteFormatPath;
	}

	return defaultFormatPath;
}
