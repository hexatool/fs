export type FilterPredicate = (path: string, isDirectory: boolean) => boolean;

export type ExcludePredicate = (dirName: string, dirPath: string) => boolean;

export interface CommonOptions {
	exclude?: ExcludePredicate;
	excludeFiles?: boolean;
	filters: FilterPredicate[];
	includeBasePath?: boolean;
	includeDirs?: boolean;
	maxDepth: number;
	normalizePath?: boolean;
	relativePaths?: boolean;
	resolvePaths?: boolean;
	resolveSymlinks?: boolean;
	suppressErrors: boolean;
}

export interface OnlyCountOptions extends CommonOptions {
	onlyCounts: true;
}

export interface GroupOptions extends CommonOptions {
	group: true;
}

export type Options = CommonOptions | GroupOptions | OnlyCountOptions;

export interface Counts {
	directories: number;
	files: number;
}

export interface Group {
	directory: string;
	files: string[];
}

export type GroupOutput = Group[];
export type OnlyCountsOutput = Counts;
export type PathsOutput = string[];

export type Output = GroupOutput | OnlyCountsOutput | PathsOutput;
