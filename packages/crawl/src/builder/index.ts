import type { Dirent } from 'node:fs';
import type { Readable } from 'node:stream';

import {
	DirentAsyncCrawler,
	DirentSyncCrawler,
	StringAsyncCrawler,
	StringSyncCrawler,
} from '../crawler';
import { DirentIteratorCrawler, StringIteratorCrawler } from '../crawler/IteratorCrawler';
import { DirentStreamCrawler, StringStreamCrawler } from '../crawler/StreamCrawler';
import type { Crawler, CrawlerOptions } from '../types';
import type Builder from '../types/builder';
import type { CrawlerDownOptions } from '../types/options';

abstract class CommonCrawlerBuilder<T extends CrawlerOptions, O extends Dirent | string>
	implements Builder<O>
{
	protected readonly options: T;

	protected constructor(options: T) {
		this.options = options;
	}

	abstract async(): Crawler<Promise<O[]>>;

	abstract iterator(): Crawler<AsyncIterableIterator<O>>;

	abstract stream(): Crawler<Readable>;

	abstract sync(): Crawler<O[]>;
}

class CrawlerDownWithDirentBuilder extends CommonCrawlerBuilder<CrawlerDownOptions, Dirent> {
	constructor(options: CrawlerDownOptions) {
		super({
			...options,
			direction: 'down',
			returnType: 'Dirent',
		});
	}

	async(): Crawler<Promise<Dirent[]>> {
		return new DirentAsyncCrawler();
	}

	iterator(): Crawler<AsyncIterableIterator<Dirent>> {
		return new DirentIteratorCrawler();
	}

	stream(): Crawler<Readable> {
		return new DirentStreamCrawler();
	}

	sync(): Crawler<Dirent[]> {
		return new DirentSyncCrawler();
	}
}

class CrawlerDownBuilder extends CommonCrawlerBuilder<CrawlerDownOptions, string> {
	constructor() {
		super({
			direction: 'down',
			returnType: 'string',
		});
	}

	async(): Crawler<Promise<string[]>> {
		return new StringAsyncCrawler();
	}

	iterator(): Crawler<AsyncIterableIterator<string>> {
		return new StringIteratorCrawler();
	}

	stream(): Crawler<Readable> {
		return new StringStreamCrawler();
	}

	sync(): Crawler<string[]> {
		return new StringSyncCrawler();
	}

	withDirent(): CrawlerDownWithDirentBuilder {
		return new CrawlerDownWithDirentBuilder(this.options);
	}
}

export default abstract class CrawlerBuilder {
	static down(): CrawlerDownBuilder {
		return new CrawlerDownBuilder();
	}
}
