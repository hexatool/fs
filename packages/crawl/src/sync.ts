import type { Dirent } from 'node:fs';

import builder from './builder';
import type { CrawlerOptions } from './types';
import type { DirentCrawlerOptions, StringCrawlerOptions } from './types/options';

export type { CrawlerOptions };

export default function crawl(options: DirentCrawlerOptions): Dirent[];
export default function crawl(options: StringCrawlerOptions): string[];
export default function crawl(path: string, options: DirentCrawlerOptions): Dirent[];
export default function crawl(path: string, options: StringCrawlerOptions): string[];
export default function crawl(
	pathOrOptions: CrawlerOptions | string,
	options?: CrawlerOptions
): (Dirent | string)[] {
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
		return b.withDirent().sync().start(path);
	}

	return b.sync().start(path);
}
