import type { Dirent } from 'node:fs';
import { resolve as pathResolve, sep } from 'node:path';

import invokeCallback, { type InvokeCallbackFunction } from './functions/invoke-callback';
import joinDirectoryPath from './functions/join-directory-path';
import joinPath, { type JoinPathFunction } from './functions/join-path';
import type { NextDirectoryPathFunction } from './functions/next-directory-path';
import nextDirectoryPath from './functions/next-directory-path';
import pushDirectory, { type PushDirectoryFunction } from './functions/push-directory';
import pushFile, { type PushFileFunction } from './functions/push-file';
import resolveSymlink, { type ResolveSymlinkFunction } from './functions/resolve-symlink';
import walkDirectory, { type WalkDirectoryFunction } from './functions/walk-directory';
import type { CrawlDirection, Options } from './options';
import { CrawlerQueue } from './queue';
import { cleanPath } from './utils';

export interface CrawlerState {
	options: Options;
	paths: string[];
	queue: CrawlerQueue;
}

export type ResultCallback = (error: Error | undefined, output: string[]) => void;

export class Crawler {
	private readonly callbackInvoker: InvokeCallbackFunction;
	private readonly direction: CrawlDirection;
	private readonly isSynchronous: boolean;
	private readonly joinPath: JoinPathFunction;
	private readonly nextDirectoryPath: NextDirectoryPathFunction;
	private readonly pushDirectory: PushDirectoryFunction;
	private readonly pushFile: PushFileFunction;
	private readonly resolveSymlink?: ResolveSymlinkFunction | undefined;
	private readonly state: CrawlerState;
	private readonly walkDirectory: WalkDirectoryFunction;

	constructor(root: string, options: Options, callback?: ResultCallback) {
		this.isSynchronous = !callback;

		this.state = {
			// Perf: we explicitly tell the compiler to optimize for String arrays
			paths: [''].slice(0, 0),
			options,
			queue: new CrawlerQueue((error, state) => this.callbackInvoker(state, error, callback)),
		};
		this.direction = options.direction;
		this.callbackInvoker = invokeCallback(this.isSynchronous);
		this.joinPath = joinPath(root, options);
		this.pushDirectory = pushDirectory(options);
		this.pushFile = pushFile(options);
		this.resolveSymlink = resolveSymlink(options, this.isSynchronous);
		this.walkDirectory = walkDirectory(this.isSynchronous);
		this.nextDirectoryPath = nextDirectoryPath(this.direction);
	}

	start(root: string, depth: number): string[] | undefined {
		const normalizePath = this.normalizePath(root);
		this.walkDirectory(this.state, normalizePath, depth, this.walk);

		return this.isSynchronous ? this.callbackInvoker(this.state, undefined) : undefined;
	}

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

	private readonly walk = (entries: Dirent[], directoryPath: string, depth: number) => {
		const {
			paths,
			options: { filters, resolveSymlinks, exclude },
		} = this.state;

		this.pushDirectory(directoryPath, paths, filters);

		const files = this.state.paths;
		for (const entry of entries) {
			if (entry.isFile() || (entry.isSymbolicLink() && !resolveSymlinks)) {
				const filename = this.joinPath(entry.name, directoryPath);
				this.pushFile(filename, files, filters);
			} else if (entry.isDirectory()) {
				const path = this.nextDirectoryPath(directoryPath, entry.name);
				if (exclude && exclude(entry.name, path)) {
					continue;
				}
				this.walkDirectory(this.state, path, depth - 1, this.walk);
			} else if (entry.isSymbolicLink() && resolveSymlinks) {
				const path = joinDirectoryPath(entry.name, directoryPath);
				this.resolveSymlink!(path, this.state, (stat, resolvedPath) => {
					if (stat.isDirectory()) {
						const normalizePath = this.normalizePath(resolvedPath);
						if (exclude && exclude(entry.name, normalizePath)) {
							return;
						}

						this.walkDirectory(this.state, normalizePath, depth - 1, this.walk);
					} else {
						this.pushFile(resolvedPath, files, filters);
					}
				});
			}
		}
	};
}
