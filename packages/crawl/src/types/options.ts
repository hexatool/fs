import type { Dirent } from 'node:fs';
import type { Readable } from 'node:stream';

export const directions = ['down'] as const;
export type CrawlDirection = (typeof directions)[number];

export const resultTypes = ['string', 'Dirent'] as const;
export type ResultType = (typeof resultTypes)[number];
export type ResultTypeOutput = Dirent | string;

export const apiTypes = ['async', 'sync', 'stream', 'iterator'] as const;
export type ApiType = (typeof apiTypes)[number];

export type ApiResultType<Output extends ResultTypeOutput> =
	| AsyncIterableIterator<Output[]>
	| Output[]
	| Promise<Output[]>
	| Readable;

export const emitEvents = ['close', 'data', 'end', 'error', 'pause', 'readable', 'resume'] as const;
export type EmitEvents = (typeof emitEvents)[number];

export type CallBack<Result> = (error: NodeJS.ErrnoException | null, result: Result) => void;

export type ExcludePathFn = (path: string) => boolean;
export type ExcludeType = ExcludePathFn | RegExp | string;

export interface CrawlerOptions {
	direction: CrawlDirection;
	exclude?: ExcludeType;
	returnType: ResultType;
}

export interface DirentCrawlerOptions extends CrawlerOptions {
	returnType: 'Dirent';
}

export interface StringCrawlerOptions extends CrawlerOptions {
	returnType: 'string';
}
