import readDirectory, { SyncReadDirectory } from '../fn/read-directory';
import type { Crawler, CrawlerOptions, ResultTypeOutput } from '../types';

export class SyncCrawler<Output extends ResultTypeOutput> implements Crawler<Output[]> {
	private readonly readDirectory: SyncReadDirectory<Output>;
	constructor(options: CrawlerOptions) {
		this.readDirectory = readDirectory('sync', options) as SyncReadDirectory<Output>;
	}

	start(path: string): Output[] {
		return this.readDirectory(path);
	}
}
