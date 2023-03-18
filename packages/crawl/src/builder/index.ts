import process from 'node:process';
import type { Readable } from 'node:stream';

import { AsyncCrawler, IteratorCrawler, StreamCrawler, SyncCrawler } from '../crawler';
import type { CrawlerOptions, ExtendedDirent } from '../types';
import type {
	DirentExcludeItemType,
	ExcludeType,
	ResultTypeOutput,
	StringExcludeItemType,
} from '../types/options';

export default class CrawlerBuilder<Output extends ResultTypeOutput> {
	protected readonly options: CrawlerOptions;

	protected constructor(options: CrawlerOptions) {
		this.options = options;
	}

	// eslint-disable-next-line no-use-before-define
	static dirent(): DirentCrawlerBuilder {
		// eslint-disable-next-line no-use-before-define
		return new DirentCrawlerBuilder({
			returnType: 'Dirent',
			direction: 'down',
		});
	}

	// eslint-disable-next-line no-use-before-define
	static string(): StringCrawlerBuilder {
		// eslint-disable-next-line no-use-before-define
		return new StringCrawlerBuilder({
			returnType: 'string',
			direction: 'down',
		});
	}

	async async(path: string = process.cwd()): Promise<Output[]> {
		return new AsyncCrawler(this.options).start(path) as Promise<Output[]>;
	}

	down(): this {
		this.options.direction = 'down';

		return this;
	}

	exclude(exclude: ExcludeType): this {
		this.options.exclude = exclude;

		return this;
	}

	iterator(path: string = process.cwd()): AsyncIterableIterator<Output> {
		return new IteratorCrawler(this.options).start(path) as AsyncIterableIterator<Output>;
	}

	stream(path: string = process.cwd()): Readable {
		return new StreamCrawler(this.options).start(path);
	}

	sync(path: string = process.cwd()): Output[] {
		return new SyncCrawler(this.options).start(path) as Output[];
	}

	withAbsolutePaths(): this {
		this.options.pathType = 'absolute';

		return this;
	}

	withRelativePaths(): this {
		this.options.pathType = 'relative';

		return this;
	}
}

class StringCrawlerBuilder extends CrawlerBuilder<string> {
	excludeDirectories(exclude: StringExcludeItemType): this {
		this.options.excludeDirectories = exclude;

		return this;
	}

	excludeFiles(exclude: StringExcludeItemType): this {
		this.options.excludeFiles = exclude;

		return this;
	}
}

class DirentCrawlerBuilder extends CrawlerBuilder<ExtendedDirent> {
	excludeDirectories(exclude: DirentExcludeItemType): this {
		this.options.excludeDirectories = exclude;

		return this;
	}

	excludeFiles(exclude: DirentExcludeItemType): this {
		this.options.excludeFiles = exclude;

		return this;
	}
}
