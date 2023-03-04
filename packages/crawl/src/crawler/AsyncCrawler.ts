import type { Dirent } from 'node:fs';

import process from 'process';

import readDirFn, { CallbackReadDirFn } from '../fn/read-dir';
import type { Crawler, CrawlerOptions } from '../types';

abstract class AsyncCrawler<O extends Dirent | string> implements Crawler<Promise<O[]>> {
	async start(path: string = process.cwd()): Promise<O[]> {
		return this.readdir(path);
	}

	abstract readdir(path: string): Promise<O[]>;
}

export class StringAsyncCrawler extends AsyncCrawler<string> {
	private readonly readDirFn: CallbackReadDirFn<string>;
	constructor(private readonly options: CrawlerOptions) {
		super();
		this.readDirFn = readDirFn('callback', 'string', this.options.exclude);
	}

	async readdir(path: string): Promise<string[]> {
		return new Promise((resolve, reject) => {
			this.readDirFn(path, (error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			});
		});
	}
}

export class DirentAsyncCrawler extends AsyncCrawler<Dirent> {
	private readonly readDirFn: CallbackReadDirFn<Dirent>;
	constructor(private readonly options: CrawlerOptions) {
		super();
		this.readDirFn = readDirFn('callback', 'Dirent', this.options.exclude);
	}

	async readdir(path: string): Promise<Dirent[]> {
		return new Promise((resolve, reject) => {
			this.readDirFn(path, (error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			});
		});
	}
}
