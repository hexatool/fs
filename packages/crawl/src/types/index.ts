import type Crawler from './crawler';
import type { CommonCrawlerOptions, CrawlDirection, CrawlerOptions, ReturnType } from './options';
import { directions, resultTypes } from './options';

export const apiTypes = ['async', 'sync', 'stream', 'iterator'] as const;
export type ApiType = (typeof apiTypes)[number];

export const emitEvents = ['close', 'data', 'end', 'error', 'pause', 'readable', 'resume'] as const;
export type EmitEvents = (typeof emitEvents)[number];

export type CallBack<Result> = (error: NodeJS.ErrnoException | null, result: Result) => void;

export type { CrawlDirection, ReturnType };

export { CommonCrawlerOptions, Crawler, CrawlerOptions, directions, resultTypes };
