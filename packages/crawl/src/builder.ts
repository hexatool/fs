import { parse, resolve } from 'node:path';

import * as process from 'process';

import findAsync from './async';
import type {
	CommonCrawlerOptions,
	CrawlDirection,
	CrawlerDownOptions,
	CrawlerUpOptions,
	ExcludePredicate,
	FilterPredicate,
} from './options';
import findSync from './sync';

function getSystemStop() {
	const directory = resolve(process.cwd());
	const { root } = parse(directory);

	return resolve(directory, root);
}

abstract class CommonCrawlerBuilder<TOptions extends CommonCrawlerOptions> {
	protected readonly commonOptions: TOptions;

	protected constructor(direction: CrawlDirection) {
		// @ts-ignore
		this.commonOptions = {
			maxDepth: Infinity,
			suppressErrors: true,
			direction,
			filters: [],
			stopAt: direction === 'up' ? getSystemStop() : undefined,
		};
	}

	async async(path: string): Promise<string[]> {
		return findAsync(path, this.options());
	}

	exclude(predicate: ExcludePredicate) {
		this.commonOptions.exclude = predicate;

		return this;
	}

	filter(predicate: FilterPredicate) {
		if (!this.commonOptions.filters) {
			this.commonOptions.filters = [];
		}
		this.commonOptions.filters.push(predicate);

		return this;
	}

	normalize() {
		this.commonOptions.normalizePath = true;

		return this;
	}

	onlyDirs() {
		this.commonOptions.excludeFiles = true;
		this.commonOptions.includeDirs = true;

		return this;
	}

	options(): TOptions {
		return this.commonOptions;
	}

	sync(path: string): string[] {
		return findSync(path, this.options());
	}

	withDirs() {
		this.commonOptions.includeDirs = true;

		return this;
	}

	withErrors() {
		this.commonOptions.suppressErrors = false;

		return this;
	}

	withSymlinks() {
		this.commonOptions.resolveSymlinks = true;
		this.commonOptions.resolvePaths = true;
		this.commonOptions.includeBasePath = true;

		return this;
	}
}

class CrawlerUpBuilder extends CommonCrawlerBuilder<CrawlerUpOptions> {
	constructor() {
		super('up');
		this.commonOptions.resolvePaths = true;
		this.commonOptions.includeBasePath = true;
	}

	withStopAt(stopAt: string): CrawlerUpBuilder {
		this.commonOptions.stopAt = stopAt;

		return this;
	}
}

class CrawlerDownBuilder extends CommonCrawlerBuilder<CrawlerDownOptions> {
	constructor() {
		super('down');
	}

	withBasePath(): CrawlerDownBuilder {
		this.commonOptions.includeBasePath = true;

		return this;
	}

	withFullPaths(): CrawlerDownBuilder {
		this.commonOptions.resolvePaths = true;
		this.commonOptions.includeBasePath = true;

		return this;
	}

	withMaxDepth(depth: number): CrawlerDownBuilder {
		this.commonOptions.maxDepth = depth;

		return this;
	}

	withRelativePaths(): CrawlerDownBuilder {
		this.commonOptions.relativePaths = true;

		return this;
	}
}

export default abstract class CrawlerBuilder {
	static down(): CrawlerDownBuilder {
		return new CrawlerDownBuilder();
	}

	static up(): CrawlerUpBuilder {
		return new CrawlerUpBuilder();
	}
}
