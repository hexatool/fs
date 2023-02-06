export type FilterPredicate = (path: string, isDirectory: boolean) => boolean;

export type ExcludePredicate = (dirName: string, dirPath: string) => boolean;

export interface Options {
	exclude?: ExcludePredicate;
	excludeFiles?: boolean;
	filters?: FilterPredicate[];
	includeBasePath?: boolean;
	includeDirs?: boolean;
	maxDepth?: number;
	normalizePath?: boolean;
	relativePaths?: boolean;
	resolvePaths?: boolean;
	resolveSymlinks?: boolean;
	suppressErrors?: boolean;
}
