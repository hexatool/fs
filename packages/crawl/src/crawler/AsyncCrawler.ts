import type { Dirent } from 'node:fs';

import type { PathLike } from 'fs';
import process from 'process';

import readDirFn, { CallbackReadDirFn } from '../fn/read-dir';
import type { Crawler } from '../types';

abstract class AsyncCrawler<O extends Dirent | string> implements Crawler<Promise<O[]>> {
	async start(path: PathLike = process.cwd()): Promise<O[]> {
		return this.readdir(path);
	}

	abstract readdir(path: PathLike): Promise<O[]>;
}

export class StringAsyncCrawler extends AsyncCrawler<string> {
	private readonly readDirFn: CallbackReadDirFn<string>;
	constructor() {
		super();
		this.readDirFn = readDirFn('callback', 'string');
	}

	async readdir(path: PathLike): Promise<string[]> {
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
	constructor() {
		super();
		this.readDirFn = readDirFn('callback', 'Dirent');
	}

	async readdir(path: PathLike): Promise<Dirent[]> {
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
