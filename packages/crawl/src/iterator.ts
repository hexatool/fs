import type { Dirent } from 'node:fs';

import { DirentIteratorCrawler, StringIteratorCrawler } from './crawler/IteratorCrawler';
import type { CrawlerOptions, DirentCrawlerOptions, StringCrawlerOptions } from './types';
import { DEFAULT_CRAWL_OPTIONS } from './types/options';

export type { CrawlerOptions };

export default function crawl(): AsyncIterableIterator<string>;
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
	pathOrOptions?: CrawlerOptions | string,
	options?: CrawlerOptions
): AsyncIterableIterator<Dirent | string> {
	let path =
		pathOrOptions === undefined
			? undefined
			: typeof pathOrOptions === 'string'
			? pathOrOptions
			: 'direction' in pathOrOptions
			? undefined
			: pathOrOptions;
	path = path ?? process.cwd();

	let opts =
		pathOrOptions === undefined
			? undefined
			: typeof pathOrOptions === 'string'
			? options
			: 'direction' in pathOrOptions
			? pathOrOptions
			: options;

	opts = opts ?? DEFAULT_CRAWL_OPTIONS;

	if (opts.returnType === 'Dirent') {
		return new DirentIteratorCrawler(opts).start(path);
	}

	return new StringIteratorCrawler(opts).start(path);
}
