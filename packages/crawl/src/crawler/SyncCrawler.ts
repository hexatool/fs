import type { Dirent } from 'node:fs';

import type { PathLike } from 'fs';
import * as process from 'process';

import readDirFn, { SyncReadDirFn } from '../fn/read-dir';
import type { Crawler } from '../types';

abstract class SyncCrawler<O extends Dirent | string> implements Crawler<O[]> {
	start(path: PathLike = process.cwd()): O[] {
		return this.readdir(path);
	}

	abstract readdir(path: PathLike): O[];
}

export class StringSyncCrawler extends SyncCrawler<string> {
	private readonly readDirFn: SyncReadDirFn<string>;
	constructor() {
		super();
		this.readDirFn = readDirFn('sync', 'string');
	}

	readdir(path: PathLike): string[] {
		return this.readDirFn(path);
	}
}

export class DirentSyncCrawler extends SyncCrawler<Dirent> {
	private readonly readDirFn: SyncReadDirFn<Dirent>;
	constructor() {
		super();
		this.readDirFn = readDirFn('sync', 'Dirent');
	}

	readdir(path: PathLike): Dirent[] {
		return this.readDirFn(path);
	}
}
