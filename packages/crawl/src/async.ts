import type { Dirent } from 'node:fs';

import builder from './builder';
import type { CrawlerOptions } from './types';
import type { DirentCrawlerOptions, StringCrawlerOptions } from './types/options';

export type { CrawlerOptions };
export default function crawl(options: DirentCrawlerOptions): Promise<Dirent[]>;
export default function crawl(options: StringCrawlerOptions): Promise<string[]>;
export default function crawl(path: string, options: DirentCrawlerOptions): Promise<Dirent[]>;
export default function crawl(path: string, options: StringCrawlerOptions): Promise<string[]>;
export default async function crawl(
	pathOrOptions: CrawlerOptions | string,
	options?: CrawlerOptions
): Promise<(Dirent | string)[]> {
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
		return b.withDirent().async().start(path);
	}

	return b.async().start(path);
}
