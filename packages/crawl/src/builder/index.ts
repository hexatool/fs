import type { Dirent } from 'node:fs';
import process from 'node:process';
import type { Readable } from 'node:stream';

import {
	DirentAsyncCrawler,
	DirentSyncCrawler,
	StringAsyncCrawler,
	StringSyncCrawler,
} from '../crawler';
import { DirentIteratorCrawler, StringIteratorCrawler } from '../crawler/IteratorCrawler';
import { DirentStreamCrawler, StringStreamCrawler } from '../crawler/StreamCrawler';
import type { CrawlerOptions } from '../types';
import type { ExcludeType, ResultTypeOutput } from '../types/options';

export default class CrawlerBuilder<Output extends ResultTypeOutput> {
	private readonly options: CrawlerOptions;

	protected constructor(options: CrawlerOptions) {
		this.options = options;
	}

	static down(): CrawlerBuilder<string> {
		return new CrawlerBuilder<string>({
			returnType: 'string',
			direction: 'down',
		});
	}

	async async(path: string = process.cwd()): Promise<Output[]> {
		if (this.options.returnType === 'string') {
			// @ts-ignore
			return new StringAsyncCrawler(this.options).start(path);
		}

		// @ts-ignore
		return new DirentAsyncCrawler(this.options).start(path);
	}

	exclude(exclude: ExcludeType): CrawlerBuilder<Output> {
		this.options.exclude = exclude;

		return this;
	}

	iterator(path: string = process.cwd()): AsyncIterableIterator<Output> {
		if (this.options.returnType === 'string') {
			// @ts-ignore
			return new StringIteratorCrawler(this.options).start(path);
		}

		// @ts-ignore
		return new DirentIteratorCrawler(this.options).start(path);
	}

	stream(path: string = process.cwd()): Readable {
		if (this.options.returnType === 'string') {
			return new StringStreamCrawler(this.options).start(path);
		}

		return new DirentStreamCrawler(this.options).start(path);
	}

	sync(path: string = process.cwd()): Output[] {
		if (this.options.returnType === 'string') {
			// @ts-ignore
			return new StringSyncCrawler(this.options).start(path);
		}

		// @ts-ignore
		return new DirentSyncCrawler(this.options).start(path);
	}

	withDirent(): CrawlerBuilder<Dirent> {
		this.options.returnType = 'Dirent';

		// @ts-ignore
		return this;
	}

	withString(): CrawlerBuilder<string> {
		this.options.returnType = 'string';

		// @ts-ignore
		return this;
	}
}
