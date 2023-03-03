import type { Readable } from 'node:stream';

import type { PathLike } from 'fs';

import builder from './builder';
import type { CrawlerOptions } from './types';

export default function crawl(
	pathOrOptions: CrawlerOptions | PathLike,
	options?: CrawlerOptions
): Readable {
	const path =
		typeof pathOrOptions === 'string'
			? pathOrOptions
			: 'direction' in pathOrOptions
			? undefined
			: pathOrOptions;
	const opts =
		typeof pathOrOptions === 'string'
			? options
			: 'direction' in pathOrOptions
			? pathOrOptions
			: options;
	if (!opts) {
		throw new Error(`options could not be undefined`);
	}

	const b = builder[opts.direction]();
	if (opts.returnType === 'Dirent') {
		return b.withDirent().stream().start(path);
	}

	return b.stream().start(path);
}
