import type { Dirent } from 'node:fs';
import { basename, dirname, resolve as pathResolve, sep } from 'node:path';

import invokeCallback, { type InvokeCallbackFunction } from './functions/invoke-callback';
import joinDirectoryPath from './functions/join-directory-path';
import joinPath, { type JoinPathFunction } from './functions/join-path';
import pushDirectory, { type PushDirectoryFunction } from './functions/push-directory';
import pushFile, { type PushFileFunction } from './functions/push-file';
import resolveSymlink, { type ResolveSymlinkFunction } from './functions/resolve-symlink';
import walkDirectory, { type WalkDirectoryFunction } from './functions/walk-directory';
import type { CrawlDirection, CrawlerOptions, ExcludePredicate } from './options';
import { checkOptions } from './options';
import { CrawlerQueue } from './queue';
import { cleanPath } from './utils';

export interface CrawlerState {
	options: CrawlerOptions;
	paths: string[];
	queue: CrawlerQueue;
}

export type ResultCallback = (error: Error | undefined, output: string[]) => void;

export class Crawler {
	private readonly callbackInvoker: InvokeCallbackFunction;
	private readonly direction: CrawlDirection;
	private readonly isSynchronous: boolean;
	private readonly joinPath: JoinPathFunction;
	private readonly pushDirectory: PushDirectoryFunction;
	private readonly pushFile: PushFileFunction;
	private readonly resolveSymlink?: ResolveSymlinkFunction | undefined;
	private readonly state: CrawlerState;
	private readonly stopAt?: string | undefined;
	private readonly walkDirectory: WalkDirectoryFunction;

	constructor(root: string, options: CrawlerOptions, callback?: ResultCallback) {
		checkOptions(options);
		this.isSynchronous = !callback;

		this.state = {
			// Perf: we explicitly tell the compiler to optimize for String arrays
			paths: [''].slice(0, 0),
			options,
			queue: new CrawlerQueue((error, state) => this.callbackInvoker(state, error, callback)),
		};
		this.direction = options.direction;
		this.stopAt =
			'stopAt' in options && options.stopAt ? this.normalizePath(options.stopAt) : undefined;
		this.callbackInvoker = invokeCallback(this.isSynchronous);
		this.joinPath = joinPath(root, options);
		this.pushDirectory = pushDirectory(options);
		this.pushFile = pushFile(options);
		this.resolveSymlink = resolveSymlink(this.isSynchronous, options);
		this.walkDirectory = walkDirectory(this.isSynchronous, options);
	}

	start(root: string, depth: number): string[] | undefined {
		const normalizePath = this.normalizePath(root);
		this.walkDirectory(this.state, normalizePath, depth, this.crawl);

		return this.isSynchronous ? this.callbackInvoker(this.state, undefined) : undefined;
	}

	private readonly crawl = (entries: Dirent[], directoryPath: string, depth: number) => {
		const {
			paths,
			options: { filters, exclude },
		} = this.state;

		const resolveSymlinks =
			'resolveSymlinks' in this.state.options && this.state.options.resolveSymlinks;

		this.pushDirectory(directoryPath, paths, filters);

		const files = this.state.paths;
		for (const entry of entries) {
			if (entry.isFile() || (entry.isSymbolicLink() && !resolveSymlinks)) {
				const filename = this.joinPath(entry.name, directoryPath);
				this.pushFile(filename, files, filters);
			} else if (entry.isDirectory()) {
				const nextDirectory = joinDirectoryPath(entry.name, directoryPath);

				if (exclude && exclude(entry.name, nextDirectory)) {
					continue;
				}

				if (this.direction === 'up') {
					this.pushDirectory(nextDirectory, paths, filters);
					continue;
				}

				this.walkDirectory(this.state, nextDirectory, depth - 1, this.crawl);
			} else if (entry.isSymbolicLink() && resolveSymlinks) {
				const path = joinDirectoryPath(entry.name, directoryPath);
				this.resolveSymlink!(path, this.state, (stat, resolvedPath) => {
					if (stat.isDirectory()) {
						const normalizePath = this.normalizePath(resolvedPath);
						if (exclude && exclude(entry.name, normalizePath)) {
							return;
						}

						if (this.direction === 'up') {
							this.pushDirectory(normalizePath, paths, filters);
						} else {
							this.walkDirectory(this.state, normalizePath, depth - 1, this.crawl);
						}
					} else {
						this.pushFile(resolvedPath, files, filters);
					}
				});
			}
		}

		if (this.direction === 'up' && directoryPath !== this.stopAt) {
			const nextDirectory = this.previousDirectory(directoryPath, exclude);
			if (nextDirectory) {
				this.walkDirectory(this.state, nextDirectory, depth - 1, this.crawl);
			}
		}
	};

	private normalizePath(path: string) {
		let copyPath = path;
		if (this.state.options.resolvePaths) {
			copyPath = pathResolve(copyPath);
		}
		if (this.state.options.normalizePath) {
			copyPath = cleanPath(copyPath);
		}
		const needsSeparator = copyPath[copyPath.length - 1] !== sep;

		return needsSeparator ? copyPath + sep : copyPath;
	}

	private previousDirectory(
		directoryPath: string,
		exclude?: ExcludePredicate
	): string | undefined {
		const dirName = basename(directoryPath);
		const nextDirectory = this.normalizePath(dirname(directoryPath));
		if (exclude && exclude(dirName, directoryPath)) {
			const stepNextDirectory = this.normalizePath(dirname(directoryPath));

			return this.previousDirectory(stepNextDirectory, exclude);
		}

		return nextDirectory;
	}
}
