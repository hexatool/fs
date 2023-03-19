import { join } from 'node:path';

import type { ExtendedDirent, ReadDirectory, ResultType, ResultTypeOutput } from '../types';
import readDirectoryMapperInterceptor from '../utils/read-directory-mapper-interceptor';

export default function readDirectoryResultType(
	fn: ReadDirectory<ExtendedDirent>,
	returnType?: ResultType
): ReadDirectory<ResultTypeOutput> {
	if (returnType === 'string') {
		return readDirectoryMapperInterceptor(fn, (_p, dir) =>
			dir.path ? join(dir.path, dir.name) : dir.name
		);
	}

	return fn;
}
