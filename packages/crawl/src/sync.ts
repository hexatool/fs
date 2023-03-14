import type { Dirent } from 'node:fs';

import { SyncCrawler } from './crawler';
import type { CrawlerOptions, DirentCrawlerOptions, StringCrawlerOptions } from './types';
import { DEFAULT_CRAWL_OPTIONS, ResultTypeOutput } from './types/options';

export type { CrawlerOptions };

export default function crawl(): string[];
export default function crawl(options: DirentCrawlerOptions): Dirent[];
export default function crawl(options: StringCrawlerOptions): string[];
export default function crawl(path: string, options: DirentCrawlerOptions): Dirent[];
export default function crawl(path: string, options: StringCrawlerOptions): string[];
export default function crawl(
	pathOrOptions?: CrawlerOptions | string,
	options?: CrawlerOptions
): ResultTypeOutput[] {
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

	return new SyncCrawler(opts).start(path);
}
