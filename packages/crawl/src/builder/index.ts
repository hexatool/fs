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
import type { ExcludeDirentType, ExcludeType, ResultTypeOutput } from '../types/options';

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
			return new StringAsyncCrawler(this.options).start(path) as Promise<Output[]>;
		}

		return new DirentAsyncCrawler(this.options).start(path) as Promise<Output[]>;
	}

	exclude(exclude: ExcludeType): CrawlerBuilder<Output> {
		this.options.exclude = exclude;

		return this;
	}

	excludeDirectories(exclude: ExcludeDirentType): CrawlerBuilder<Output> {
		this.options.excludeDirectories = exclude;

		return this;
	}

	excludeFiles(exclude: ExcludeDirentType): CrawlerBuilder<Output> {
		this.options.excludeFiles = exclude;

		return this;
	}

	iterator(path: string = process.cwd()): AsyncIterableIterator<Output> {
		if (this.options.returnType === 'string') {
			return new StringIteratorCrawler(this.options).start(
				path
			) as AsyncIterableIterator<Output>;
		}

		return new DirentIteratorCrawler(this.options).start(path) as AsyncIterableIterator<Output>;
	}

	stream(path: string = process.cwd()): Readable {
		if (this.options.returnType === 'string') {
			return new StringStreamCrawler(this.options).start(path);
		}

		return new DirentStreamCrawler(this.options).start(path);
	}

	sync(path: string = process.cwd()): Output[] {
		if (this.options.returnType === 'string') {
			return new StringSyncCrawler(this.options).start(path) as Output[];
		}

		return new DirentSyncCrawler(this.options).start(path) as Output[];
	}

	withDirent(): CrawlerBuilder<Dirent> {
		this.options.returnType = 'Dirent';

		return this as CrawlerBuilder<Dirent>;
	}

	withString(): CrawlerBuilder<string> {
		this.options.returnType = 'string';

		return this as CrawlerBuilder<string>;
	}
}
