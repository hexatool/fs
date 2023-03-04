import type { Readable } from 'node:stream';

import * as process from 'process';

import type { Crawler, CrawlerOptions } from '../types';
import {
	DirentFileSystemStreamCrawler,
	StringFileSystemStreamCrawler,
} from './FileSystemStreamCrawler';

abstract class StreamCrawler implements Crawler<Readable> {
	constructor(protected readonly options: CrawlerOptions) {}

	start(path = process.cwd()): Readable {
		return this.readdir(path);
	}

	abstract readdir(path: string): Readable;
}

export class StringStreamCrawler extends StreamCrawler {
	readdir(path: string): Readable {
		return new StringFileSystemStreamCrawler(path, this.options).stream;
	}
}

export class DirentStreamCrawler extends StreamCrawler {
	readdir(path: string): Readable {
		return new DirentFileSystemStreamCrawler(path, this.options).stream;
	}
}
