import type { Readable } from 'node:stream';

import { DirentStreamCrawler, StringStreamCrawler } from './crawler/StreamCrawler';
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

	if (opts.returnType === 'Dirent') {
		return new DirentStreamCrawler(opts).start(path);
	}

	return new StringStreamCrawler(opts).start(path);
}
