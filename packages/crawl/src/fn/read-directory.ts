import type { Dirent } from 'node:fs';

import { fs } from '@hexatool/fs-file-system';

import type { CallBack, CrawlerOptions } from '../types';
import type { ExcludeType, ResultTypeOutput } from '../types/options';
import emptyReadDirFn from './empty-read-dir';
import filterReadDirectory from './filter-read-directory';
import matchDirectory from './match-directory';

export type CallbackReadDirectoryFn<Output extends Dirent | string> = (
	path: string,
	callback?: CallBack<Output[]>
) => void;
export type SyncReadDirectory<Output extends Dirent | string> = (path: string) => Output[];
export type ReadDirectory<Output extends Dirent | string> =
	| CallbackReadDirectoryFn<Output>
	| SyncReadDirectory<Output>;

function direntIsFileOrDirectory(dirent: Dirent) {
	return dirent.isDirectory() || dirent.isFile();
}

function callbackDirentReadDirectory(): CallbackReadDirectoryFn<Dirent> {
	return (path, callback) =>
		callback &&
		fs.readdir(path, { withFileTypes: true }, (err, files) => {
			if (err) {
				callback(err, []);
			} else {
				callback(null, files.filter(direntIsFileOrDirectory));
			}
		});
}

function syncDirentReadDirectory(): SyncReadDirectory<Dirent> {
	return path => fs.readdirSync(path, { withFileTypes: true }).filter(direntIsFileOrDirectory);
}

function callbackStringReadDirectory(): CallbackReadDirectoryFn<string> {
	return (path, callback) =>
		callback &&
		callbackDirentReadDirectory()(path, (err, files) => {
			if (err) {
				callback(err, []);
			} else {
				callback(
					null,
					files.map(d => d.name)
				);
			}
		});
}

function syncStringReadDirectory(): SyncReadDirectory<string> {
	return path => syncDirentReadDirectory()(path).map(d => d.name);
}

function excludeDirectory<T extends ResultTypeOutput>(
	fn: ReadDirectory<T>,
	exclude: ExcludeType
): ReadDirectory<T> {
	const match = matchDirectory(exclude);

	return (path, callback) => {
		const ex = match(path);
		if (ex) {
			if (callback) {
				callback(null, []);

				return;
			}

			return [];
		}

		return fn(path, callback);
	};
}

function internalReadDirectory(
	api: 'callback' | 'sync',
	options: CrawlerOptions
): ReadDirectory<ResultTypeOutput> {
	const { returnType, exclude } = options;
	let fn: ReadDirectory<ResultTypeOutput>;

	if (api === 'callback' && returnType === 'string') {
		fn = callbackStringReadDirectory();
	} else if (api === 'sync' && returnType === 'string') {
		fn = syncStringReadDirectory();
	} else if (api === 'callback') {
		fn = callbackDirentReadDirectory();
	} else {
		fn = syncDirentReadDirectory();
	}

	if (exclude) {
		return excludeDirectory(fn, exclude);
	}

	return fn;
}

function internalDirentReadDirectory(
	api: 'callback' | 'sync',
	options: CrawlerOptions
): ReadDirectory<Dirent> {
	const { exclude } = options;
	let fn: ReadDirectory<Dirent>;

	if (api === 'callback') {
		fn = callbackDirentReadDirectory();
	} else {
		fn = syncDirentReadDirectory();
	}

	if (exclude) {
		return excludeDirectory(fn, exclude);
	}

	return fn;
}

export default function readDirectory(
	api: 'callback' | 'sync',
	options: CrawlerOptions
): ReadDirectory<ResultTypeOutput> {
	const { excludeFiles, excludeDirectories } = options;

	if (excludeFiles === true && excludeDirectories === true) {
		return emptyReadDirFn(api);
	}
	if (excludeFiles === undefined && excludeDirectories === undefined) {
		return internalReadDirectory(api, options);
	}

	const fn = internalDirentReadDirectory(api, options);

	return filterReadDirectory(api, fn, options);
}
