import { resolve } from 'node:path';

import type { CrawlerOptions, ResultTypeOutput } from '../types';
import { ExtendedDirent, ReadDirectory } from '../types';
import readDirectoryInterceptor from '../utils/read-directory-interceptor';

export default function pathReadDirectory(
	fn: ReadDirectory<ResultTypeOutput>,
	options: CrawlerOptions
): ReadDirectory<ResultTypeOutput> {
	const { pathType, returnType } = options;
	if (pathType === 'absolute' && returnType === 'string') {
		return readDirectoryInterceptor(fn as ReadDirectory<string>, (path, p) => resolve(path, p));
	}
	if (pathType === 'absolute' && returnType === 'Dirent') {
		return readDirectoryInterceptor(
			fn as ReadDirectory<ExtendedDirent>,
			(path, dir) => new ExtendedDirent(resolve(path), dir.name, dir.type)
		);
	}

	return fn;
}
