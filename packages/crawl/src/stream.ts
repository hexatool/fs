import type { Readable } from 'node:stream';

import { StreamCrawler } from './crawler';
import type { CrawlerOptions } from './types';
import { DEFAULT_CRAWL_OPTIONS } from './types/options';

export type { CrawlerOptions };
export default function crawl(
	pathOrOptions?: CrawlerOptions | string,
	options?: CrawlerOptions
): Readable {
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

	return new StreamCrawler(opts).start(path);
}
