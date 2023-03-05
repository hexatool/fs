import type { Dirent } from 'node:fs';

import builder from './builder';
import type { CrawlerOptions, DirentCrawlerOptions, StringCrawlerOptions } from './types';

export type { CrawlerOptions };

export default function crawl(options: DirentCrawlerOptions): AsyncIterableIterator<Dirent>;
export default function crawl(options: StringCrawlerOptions): AsyncIterableIterator<string>;
export default function crawl(
	path: string,
	options: DirentCrawlerOptions
): AsyncIterableIterator<Dirent>;
export default function crawl(
	path: string,
	options: StringCrawlerOptions
): AsyncIterableIterator<string>;
export default function crawl(
	pathOrOptions: CrawlerOptions | string,
	options?: CrawlerOptions
): AsyncIterableIterator<Dirent | string> {
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
		return b.withDirent().iterator(path);
	}

	return b.iterator(path);
}
