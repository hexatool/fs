import type { Readable } from 'node:stream';

import type { Crawler, CrawlerOptions } from '../types';
import { FileSystemStreamCrawler } from './FileSystemStreamCrawler';

export class StreamCrawler implements Crawler<Readable> {
	constructor(private readonly options: CrawlerOptions) {}

	start(path: string): Readable {
		return new FileSystemStreamCrawler(path, this.options).stream;
	}
}
