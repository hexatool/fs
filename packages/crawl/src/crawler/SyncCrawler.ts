import type { Dirent } from 'node:fs';

import readDirFn, { SyncReadDirFn } from '../fn/read-dir';
import type { Crawler, CrawlerOptions } from '../types';

abstract class SyncCrawler<O extends Dirent | string> implements Crawler<O[]> {
	start(path: string): O[] {
		return this.readdir(path);
	}

	protected abstract readdir(path: string): O[];
}

export class StringSyncCrawler extends SyncCrawler<string> {
	private readonly readDirFn: SyncReadDirFn<Dirent>;
	constructor(options: CrawlerOptions) {
		super();
		this.readDirFn = readDirFn('sync', options);
	}

	protected readdir(path: string): string[] {
		return this.readDirFn(path).map(s => s.name);
	}
}

export class DirentSyncCrawler extends SyncCrawler<Dirent> {
	private readonly readDirFn: SyncReadDirFn<Dirent>;
	constructor(options: CrawlerOptions) {
		super();
		this.readDirFn = readDirFn('sync', options);
	}

	protected readdir(path: string): Dirent[] {
		return this.readDirFn(path);
	}
}