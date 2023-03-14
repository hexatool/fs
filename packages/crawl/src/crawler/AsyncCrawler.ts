import type { Dirent } from 'node:fs';

import readDirectory, { CallbackReadDirectoryFn, SyncReadDirectory } from '../fn/read-directory';
import type { Crawler, CrawlerOptions } from '../types';

export class AsyncCrawler<Output extends Dirent | string> implements Crawler<Promise<Output[]>> {
	private readonly readDirectory: CallbackReadDirectoryFn<Output>;
	constructor(options: CrawlerOptions) {
		this.readDirectory = readDirectory('callback', options) as SyncReadDirectory<Output>;
	}

	async start(path: string): Promise<Output[]> {
		return new Promise((resolve, reject) => {
			this.readDirectory(path, (error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			});
		});
	}
}
