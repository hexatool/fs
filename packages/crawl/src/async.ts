import { AsyncCrawler } from './crawler';
import type {
	CrawlerOptions,
	DirentCrawlerOptions,
	ExtendedDirent,
	ResultTypeOutput,
	StringCrawlerOptions,
} from './types';
import { DEFAULT_CRAWL_OPTIONS } from './types/options';

export type { CrawlerOptions, ExtendedDirent };
export default function crawl(): Promise<string[]>;
export default function crawl(options: DirentCrawlerOptions): Promise<ExtendedDirent[]>;
export default function crawl(options: StringCrawlerOptions): Promise<string[]>;
export default function crawl(
	path: string,
	options: DirentCrawlerOptions
): Promise<ExtendedDirent[]>;
export default function crawl(path: string, options: StringCrawlerOptions): Promise<string[]>;
export default async function crawl(
	pathOrOptions?: CrawlerOptions | string,
	options?: CrawlerOptions
): Promise<ResultTypeOutput[]> {
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

	return new AsyncCrawler(opts).start(path);
}
