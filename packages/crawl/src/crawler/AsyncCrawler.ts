import type { Dirent } from 'node:fs';

import readDirFn, { CallbackReadDirFn } from '../fn/read-dir';
import type { CallBack, Crawler, CrawlerOptions } from '../types';

abstract class AsyncCrawler<O extends Dirent | string> implements Crawler<Promise<O[]>> {
	async start(path: string): Promise<O[]> {
		return this.readdir(path);
	}

	abstract readdir(path: string): Promise<O[]>;
}

export class StringAsyncCrawler extends AsyncCrawler<string> {
	private readonly readDirFn: CallbackReadDirFn<Dirent>;
	constructor(private readonly options: CrawlerOptions) {
		super();
		this.readDirFn = readDirFn('callback', this.options);
	}

	async readdir(path: string): Promise<string[]> {
		return new Promise((resolve, reject) => {
			this.walk(path, (error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result);
				}
			});
		});
	}

	private walk(path: string, callback: CallBack<string[]>): void {
		this.readDirFn(path, (error, result) => {
			if (error) {
				callback(error, []);
			} else {
				callback(
					null,
					result.map(r => r.name)
				);
			}
		});
	}
}

export class DirentAsyncCrawler extends AsyncCrawler<Dirent> {
	private readonly readDirFn: CallbackReadDirFn<Dirent>;
	constructor(private readonly options: CrawlerOptions) {
		super();
		this.readDirFn = readDirFn('callback', this.options);
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
