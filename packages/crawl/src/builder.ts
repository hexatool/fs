import findAsync from './async';
import type { CrawlDirection, ExcludePredicate, FilterPredicate, Options } from './options';
import findSync from './sync';

export class CrawlerBuilder {
	protected readonly commonOptions: Options = {
		maxDepth: Infinity,
		suppressErrors: true,
		direction: 'down',
		filters: [],
	};

	constructor(options?: Partial<Options>) {
		this.commonOptions = { ...this.commonOptions, ...options };
	}

	async async(path: string): Promise<string[]> {
		// @ts-ignore
		return findAsync(path, this.options());
	}

	direction(direction: CrawlDirection): CrawlerBuilder {
		this.commonOptions.direction = direction;

		return this;
	}

	down(): CrawlerBuilder {
		this.commonOptions.direction = 'down';

		return this;
	}

	exclude(predicate: ExcludePredicate): CrawlerBuilder {
		this.commonOptions.exclude = predicate;

		return this;
	}

	filter(predicate: FilterPredicate): CrawlerBuilder {
		this.commonOptions.filters ??= [];
		this.commonOptions.filters.push(predicate);

		return this;
	}

	normalize(): CrawlerBuilder {
		this.commonOptions.normalizePath = true;

		return this;
	}

	onlyDirs(): CrawlerBuilder {
		this.commonOptions.excludeFiles = true;
		this.commonOptions.includeDirs = true;

		return this;
	}

	options(): Options {
		return this.commonOptions;
	}

	sync(path: string): string[] {
		// @ts-ignore
		return findSync(path, this.options());
	}

	up(): CrawlerBuilder {
		this.commonOptions.direction = 'up';

		return this;
	}

	withBasePath(): CrawlerBuilder {
		this.commonOptions.includeBasePath = true;

		return this;
	}

	withDirs(): CrawlerBuilder {
		this.commonOptions.includeDirs = true;

		return this;
	}

	withErrors(): CrawlerBuilder {
		this.commonOptions.suppressErrors = false;

		return this;
	}

	withFullPaths(): CrawlerBuilder {
		this.commonOptions.resolvePaths = true;
		this.commonOptions.includeBasePath = true;

		return this;
	}

	withMaxDepth(depth: number): CrawlerBuilder {
		this.commonOptions.maxDepth = depth;

		return this;
	}

	withRelativePaths(): CrawlerBuilder {
		this.commonOptions.relativePaths = true;

		return this;
	}

	withSymlinks(): CrawlerBuilder {
		this.commonOptions.resolveSymlinks = true;

		return this.withFullPaths();
	}
}
