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
import type { CrawlerDownOptions, ExcludeType } from '../types/options';

abstract class CommonCrawlerBuilder<T extends CrawlerOptions, O extends Dirent | string>
	implements Builder<O>
{
	protected readonly options: T;

	protected constructor(options: T) {
		this.options = options;
	}

	exclude(exclude: ExcludeType): CommonCrawlerBuilder<T, O> {
		this.options.exclude = exclude;

		return this;
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
		return new DirentAsyncCrawler(this.options);
	}

	iterator(): Crawler<AsyncIterableIterator<Dirent>> {
		return new DirentIteratorCrawler(this.options);
	}

	stream(): Crawler<Readable> {
		return new DirentStreamCrawler(this.options);
	}

	sync(): Crawler<Dirent[]> {
		return new DirentSyncCrawler(this.options);
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
		return new StringAsyncCrawler(this.options);
	}

	iterator(): Crawler<AsyncIterableIterator<string>> {
		return new StringIteratorCrawler(this.options);
	}

	stream(): Crawler<Readable> {
		return new StringStreamCrawler(this.options);
	}

	sync(): Crawler<string[]> {
		return new StringSyncCrawler(this.options);
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
