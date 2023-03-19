import { fs } from '@hexatool/fs-file-system';

import type {
	CallbackReadDirectoryFn,
	CrawlerOptions,
	ReadDirectory,
	SyncReadDirectory,
} from '../types';
import { ExtendedDirent } from '../types';
import type { ExcludeType, ResultTypeOutput } from '../types/options';
import emptyReadDirFn from './empty-read-dir';
import filterReadDirectory from './filter-read-directory';
import matchDirectory from './match-directory';
import pathReadDirectory from './path-read-directory';

function direntIsFileOrDirectory(dirent: ExtendedDirent) {
	return dirent.isDirectory() || dirent.isFile();
}

function callbackDirentReadDirectory(): CallbackReadDirectoryFn<ExtendedDirent> {
	return (path, callback) =>
		callback &&
		fs.readdir(path, { withFileTypes: true }, (err, files) => {
			if (err) {
				callback(err, []);
			} else {
				callback(
					undefined,
					files.map(d => new ExtendedDirent(d)).filter(direntIsFileOrDirectory)
				);
			}
		});
}

function syncDirentReadDirectory(): SyncReadDirectory<ExtendedDirent> {
	return path =>
		fs
			.readdirSync(path, { withFileTypes: true })
			.map(d => new ExtendedDirent(d))
			.filter(direntIsFileOrDirectory);
}

function callbackStringReadDirectory(): CallbackReadDirectoryFn<string> {
	return (path, callback) =>
		callback &&
		callbackDirentReadDirectory()(path, (err, files) => {
			if (err) {
				callback(err, []);
			} else {
				callback(
					undefined,
					files?.map(d => d.name)
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
				callback(undefined, []);

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
): ReadDirectory<ExtendedDirent> {
	const { exclude } = options;
	let fn: ReadDirectory<ExtendedDirent>;

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
		return pathReadDirectory(internalReadDirectory(api, options), options);
	}

	const fn = internalDirentReadDirectory(api, options);

	return filterReadDirectory(api, fn, options);
}
