import { sep } from 'node:path';

import type { CrawlerOptions } from '../options';

function joinPathWithBasePath(filename: string, directoryPath: string) {
	return directoryPath + filename;
}

function joinPathWithRelativePath(relativePath: string) {
	const path = relativePath + (relativePath[relativePath.length - 1] === sep ? '' : sep);

	return function (filename: string, directoryPath: string) {
		return directoryPath.substring(path.length) + filename;
	};
}

function joinPath(filename: string) {
	return filename;
}

export type JoinPathFunction = (filename: string, directoryPath: string) => string;

export default function (root: string, options: CrawlerOptions): JoinPathFunction {
	const { includeBasePath } = options;

	const relativePaths = 'relativePaths' in options && options.relativePaths;

	return relativePaths
		? joinPathWithRelativePath(root)
		: includeBasePath
		? joinPathWithBasePath
		: joinPath;
}