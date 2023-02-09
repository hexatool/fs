import assert from 'node:assert';

export type FilterPredicate = (path: string, isDirectory: boolean) => boolean;

export type ExcludePredicate = (dirName: string, dirPath: string) => boolean;

export type CrawlDirection = 'down' | 'up';

export interface CommonCrawlerOptions {
	direction: CrawlDirection;
	exclude?: ExcludePredicate;
	excludeFiles?: boolean;
	filters: FilterPredicate[];
	includeBasePath?: boolean;
	includeDirs?: boolean;
	normalizePath?: boolean;
	resolvePaths?: boolean;
	resolveSymlinks?: boolean;
	suppressErrors?: boolean;
}

export interface CrawlerDownOptions extends CommonCrawlerOptions {
	direction: 'down';
	maxDepth?: number;
	relativePaths?: boolean;
}

export interface CrawlerUpOptions extends CommonCrawlerOptions {
	direction: 'up';
	stopAt?: string;
}

export type CrawlerOptions = CrawlerDownOptions | CrawlerUpOptions;

function checkPropertyOptions(
	options: CrawlerOptions,
	property: keyof CommonCrawlerOptions | keyof CrawlerDownOptions | keyof CrawlerUpOptions,
	type: string
) {
	if (type === 'array') {
		assert(
			// @ts-ignore
			Array.isArray(options[property]),
			`${property} must be an ${type}`
		);
	} else {
		assert(
			// @ts-ignore
			options[property] === undefined || typeof options[property] === type,
			`${property} must be === undefined or ${type}`
		);
	}
}

export function checkOptions(options: CrawlerOptions): void {
	assert(
		options.direction !== undefined &&
			(options.direction === 'up' || options.direction === 'down'),
		`direction must be === 'up' or 'down'`
	);
	checkPropertyOptions(options, 'exclude', 'function');
	checkPropertyOptions(options, 'excludeFiles', 'boolean');
	checkPropertyOptions(options, 'filters', 'array');
	checkPropertyOptions(options, 'includeBasePath', 'boolean');
	checkPropertyOptions(options, 'includeDirs', 'boolean');
	checkPropertyOptions(options, 'normalizePath', 'boolean');
	checkPropertyOptions(options, 'resolvePaths', 'boolean');
	checkPropertyOptions(options, 'resolveSymlinks', 'boolean');
	checkPropertyOptions(options, 'suppressErrors', 'boolean');
	checkPropertyOptions(options, 'maxDepth', 'number');
	checkPropertyOptions(options, 'relativePaths', 'boolean');
	checkPropertyOptions(options, 'stopAt', 'string');

	if (options.direction === 'up' && !options.resolvePaths) {
		throw new Error(`resolvePaths must be === true if direction === 'up'`);
	}

	if (options.direction === 'up' && !options.includeBasePath) {
		throw new Error(`includeBasePath must be === true if direction === 'up'`);
	}

	if (options.resolveSymlinks && !options.resolvePaths) {
		throw new Error(`resolvePaths must be === true if resolveSymlinks === true`);
	}

	if (options.resolveSymlinks && !options.includeBasePath) {
		throw new Error(`includeBasePath must be === true if resolveSymlinks === true`);
	}
}
