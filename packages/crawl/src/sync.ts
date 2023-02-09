import { Crawler } from './crawler';
import type { CrawlerOptions } from './options';

export type { CrawlerOptions };

export default function crawl(root: string, options: CrawlerOptions): string[] {
	const crawler = new Crawler(root, options);
	const maxDepth = 'maxDepth' in options ? options.maxDepth : Infinity;

	return crawler.start(root, maxDepth) ?? [];
}
