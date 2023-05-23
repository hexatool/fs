import { SyncCrawler } from './crawler';
import type {
	CrawlerOptions,
	DirentCrawlerOptions,
	ExtendedDirent,
	ResultTypeOutput,
	StringCrawlerOptions,
} from './types';
import { DEFAULT_CRAWL_OPTIONS } from './types/options';

export type { CrawlerOptions };

export default function crawl(): string[];
export default function crawl(options: DirentCrawlerOptions): ExtendedDirent[];
export default function crawl(options: StringCrawlerOptions): string[];
export default function crawl(path: string, options: DirentCrawlerOptions): ExtendedDirent[];
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
