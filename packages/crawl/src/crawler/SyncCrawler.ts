import type { Dirent } from 'node:fs';

import * as process from 'process';

import readDirFn, { SyncReadDirFn } from '../fn/read-dir';
import type { Crawler, CrawlerOptions } from '../types';

abstract class SyncCrawler<O extends Dirent | string> implements Crawler<O[]> {
	start(path: string = process.cwd()): O[] {
		return this.readdir(path);
	}

	abstract readdir(path: string): O[];
}

export class StringSyncCrawler extends SyncCrawler<string> {
	private readonly readDirFn: SyncReadDirFn<string>;
	constructor(options: CrawlerOptions) {
		super();
		this.readDirFn = readDirFn('sync', 'string', options.exclude);
	}

	readdir(path: string): string[] {
		return this.readDirFn(path);
	}
}

export class DirentSyncCrawler extends SyncCrawler<Dirent> {
	private readonly readDirFn: SyncReadDirFn<Dirent>;
	constructor(options: CrawlerOptions) {
		super();
		this.readDirFn = readDirFn('sync', 'Dirent', options.exclude);
	}

	readdir(path: string): Dirent[] {
		return this.readDirFn(path);
	}
}
