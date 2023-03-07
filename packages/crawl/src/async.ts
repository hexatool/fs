import type { Dirent } from 'node:fs';

import { DirentAsyncCrawler, StringAsyncCrawler } from './crawler';
import type { CrawlerOptions, DirentCrawlerOptions, StringCrawlerOptions } from './types';
import { DEFAULT_CRAWL_OPTIONS } from './types/options';

export type { CrawlerOptions };
export default function crawl(): Promise<string[]>;
export default function crawl(options: DirentCrawlerOptions): Promise<Dirent[]>;
export default function crawl(options: StringCrawlerOptions): Promise<string[]>;
export default function crawl(path: string, options: DirentCrawlerOptions): Promise<Dirent[]>;
export default function crawl(path: string, options: StringCrawlerOptions): Promise<string[]>;
export default async function crawl(
	pathOrOptions?: CrawlerOptions | string,
	options?: CrawlerOptions
): Promise<(Dirent | string)[]> {
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
		return new DirentAsyncCrawler(opts).start(path);
	}

	return new StringAsyncCrawler(opts).start(path);
}
