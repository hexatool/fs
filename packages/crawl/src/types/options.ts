import type { Dirent } from 'node:fs';

export const directions = ['down'] as const;
export type CrawlDirection = (typeof directions)[number];

export const pathType = ['absolute', 'relative'] as const;
export type PathType = (typeof pathType)[number];

export const resultTypes = ['string', 'Dirent'] as const;
export type ResultType = (typeof resultTypes)[number];
export type ResultTypeOutput = Dirent | string;

export const lowerCaseResultTypes = ['string', 'dirent'] as const;
export type LowerCaseResultType = (typeof lowerCaseResultTypes)[number];

export const apiTypes = ['async', 'sync', 'stream', 'iterator'] as const;
export type ApiType = (typeof apiTypes)[number];

export const emitEvents = ['close', 'data', 'end', 'error', 'pause', 'readable', 'resume'] as const;
export type EmitEvents = (typeof emitEvents)[number];

export type CallBack<Result> = (error: NodeJS.ErrnoException | null, result: Result) => void;

export type ExcludeStringPathFn = (path: string) => boolean;
export type ExcludeItemStringPathFn = (parent: string, item: string) => boolean;
export type ExcludeItemDirentPathFn = (parent: string, item: Dirent) => boolean;
export type ExcludeItemPathFn = ExcludeItemDirentPathFn | ExcludeItemStringPathFn;
export type ExcludeType = ExcludeStringPathFn | RegExp | string;
export type ExcludeItemType = ExcludeItemPathFn | RegExp | string | true;
export type StringExcludeItemType = ExcludeItemStringPathFn | RegExp | string | true;
export type DirentExcludeItemType = ExcludeItemDirentPathFn | RegExp | string | true;

export interface CommonCrawlerOptions {
	direction: CrawlDirection;
	exclude?: ExcludeType;
	excludeDirectories?: ExcludeItemType;
	excludeFiles?: ExcludeItemType;
	pathType?: PathType;
	returnType: ResultType;
}

export interface DirentCrawlerOptions extends CommonCrawlerOptions {
	excludeDirectories?: DirentExcludeItemType;
	excludeFiles?: DirentExcludeItemType;
	returnType: 'Dirent';
}

export interface StringCrawlerOptions extends CommonCrawlerOptions {
	excludeDirectories?: StringExcludeItemType;
	excludeFiles?: StringExcludeItemType;
	returnType: 'string';
}

export type CrawlerOptions = DirentCrawlerOptions | StringCrawlerOptions;

export const DEFAULT_CRAWL_OPTIONS: StringCrawlerOptions = {
	direction: 'down',
	returnType: 'string',
} as const;
