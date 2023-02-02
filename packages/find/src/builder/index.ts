import findAsync from '../async';
import findSync from '../sync';
import type {
	ExcludePredicate,
	FilterPredicate,
	GroupOptions,
	GroupOutput,
	OnlyCountOptions,
	OnlyCountsOutput,
	Options,
	Output,
	PathsOutput,
} from '../types';

export class FindApi<TOptionsType extends Options, TReturnType extends Output = PathsOutput> {
	private readonly commonOptions: Options = {
		maxDepth: Infinity,
		suppressErrors: true,
		filters: [],
	};

	constructor(options?: Partial<Options>) {
		this.commonOptions = { ...this.commonOptions, ...options };
	}

	async async(path: string): Promise<TReturnType> {
		// @ts-ignore
		return findAsync(path, this.options());
	}

	exclude(predicate: ExcludePredicate): FindApi<TOptionsType, TReturnType> {
		this.commonOptions.exclude = predicate;

		return this;
	}

	filter(predicate: FilterPredicate): FindApi<TOptionsType, TReturnType> {
		this.commonOptions.filters.push(predicate);

		return this;
	}

	group(): FindApi<GroupOptions, GroupOutput> {
		// @ts-ignore
		delete this.commonOptions.onlyCounts;
		// @ts-ignore
		this.commonOptions.group = true;

		return this as FindApi<GroupOptions, GroupOutput>;
	}

	normalize(): FindApi<TOptionsType, TReturnType> {
		this.commonOptions.normalizePath = true;

		return this;
	}

	onlyCounts(): FindApi<OnlyCountOptions, OnlyCountsOutput> {
		// @ts-ignore
		delete this.commonOptions.group;
		// @ts-ignore
		this.commonOptions.onlyCounts = true;

		return this as FindApi<OnlyCountOptions, OnlyCountsOutput>;
	}

	onlyDirs(): FindApi<TOptionsType, TReturnType> {
		this.commonOptions.excludeFiles = true;
		this.commonOptions.includeDirs = true;

		return this;
	}

	options(): TOptionsType {
		return this.commonOptions as TOptionsType;
	}

	sync(path: string): TReturnType {
		// @ts-ignore
		return findSync(path, this.options());
	}

	withBasePath(): FindApi<TOptionsType, TReturnType> {
		this.commonOptions.includeBasePath = true;

		return this;
	}

	withDirs(): FindApi<TOptionsType, TReturnType> {
		this.commonOptions.includeDirs = true;

		return this;
	}

	withErrors(): FindApi<TOptionsType, TReturnType> {
		this.commonOptions.suppressErrors = false;

		return this;
	}

	withFullPaths(): FindApi<TOptionsType, TReturnType> {
		this.commonOptions.resolvePaths = true;
		this.commonOptions.includeBasePath = true;

		return this;
	}

	withMaxDepth(depth: number): FindApi<TOptionsType, TReturnType> {
		this.commonOptions.maxDepth = depth;

		return this;
	}

	withRelativePaths(): FindApi<TOptionsType, TReturnType> {
		this.commonOptions.relativePaths = true;

		return this;
	}

	withSymlinks(): FindApi<TOptionsType, TReturnType> {
		this.commonOptions.resolveSymlinks = true;

		return this.withFullPaths();
	}
}
