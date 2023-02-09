import type { ResultCallback } from './crawler';
import { Crawler } from './crawler';
import type { CrawlerOptions } from './options';

export type { CrawlerOptions };

function callback(root: string, options: CrawlerOptions, callback: ResultCallback) {
	const walker = new Crawler(root, options, callback);
	const maxDepth = 'maxDepth' in options ? options.maxDepth : Infinity;

	walker.start(root, maxDepth);
}

export default async function crawl(root: string, options: CrawlerOptions): Promise<string[]> {
	return new Promise<string[]>((resolve, reject) => {
		callback(root, options, (err, output) => {
			if (err) {
				reject(err);

				return;
			}
			resolve(output);
		});
	});
}
