export type FilterPredicate = (path: string, isDirectory: boolean) => boolean;

export type ExcludePredicate = (dirName: string, dirPath: string) => boolean;

export type CrawlDirection = 'down' | 'up';

export interface CommonCrawlerOptions {
	direction: CrawlDirection;
	exclude?: ExcludePredicate;
	excludeFiles?: boolean;
	filters?: FilterPredicate[];
	includeBasePath?: boolean;
	includeDirs?: boolean;
	normalizePath?: boolean;
	resolvePaths?: boolean;
	suppressErrors?: boolean;
}

export interface CrawlerDownOptions extends CommonCrawlerOptions {
	direction: 'down';
	maxDepth?: number;
	relativePaths?: boolean;
	resolveSymlinks?: boolean;
}

export interface CrawlerUpOptions extends CommonCrawlerOptions {
	direction: 'up';
}

export type CrawlerOptions = CrawlerDownOptions | CrawlerUpOptions;
