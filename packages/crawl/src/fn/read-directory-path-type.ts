import { resolve } from 'node:path';

import type { ReadDirectory } from '../types';
import { ExtendedDirent } from '../types';
import type { PathType } from '../types/options';
import readDirectoryMapperInterceptor from '../utils/read-directory-mapper-interceptor';

export default function readDirectoryPathType(
	fn: ReadDirectory<ExtendedDirent>,
	pathType?: PathType
): ReadDirectory<ExtendedDirent> {
	if (pathType === 'absolute') {
		return readDirectoryMapperInterceptor(
			fn,
			(path, dir) => new ExtendedDirent(resolve(path), dir.name, dir.type)
		);
	}

	return fn;
}
