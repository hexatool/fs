import * as fs from 'node:fs';

import type {
	CallbackReadDirectoryFn,
	CrawlerOptions,
	ReadDirectory,
	ResultTypeOutput,
	SyncReadDirectory,
} from '../types';
import { ExtendedDirent } from '../types';
import readDirectoryEmpty from './read-directory-empty';
import readDirectoryExclude from './read-directory-exclude';
import readDirectoryFilter from './read-directory-filter';
import readDirectoryPathType from './read-directory-path-type';
import readDirectoryResultType from './read-directory-result-type';

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

function internalDirentReadDirectory(api: 'callback' | 'sync'): ReadDirectory<ExtendedDirent> {
	let fn: ReadDirectory<ExtendedDirent>;

	if (api === 'callback') {
		fn = callbackDirentReadDirectory();
	} else {
		fn = syncDirentReadDirectory();
	}

	return fn;
}

export default function readDirectory(
	api: 'callback' | 'sync',
	options: CrawlerOptions
): ReadDirectory<ResultTypeOutput> {
	const { excludeFiles, excludeDirectories, pathType, returnType, exclude } = options;

	if (excludeFiles === true && excludeDirectories === true) {
		return readDirectoryEmpty(api);
	}

	let fn = internalDirentReadDirectory(api);

	fn = readDirectoryExclude(fn, exclude);

	fn = readDirectoryFilter(fn, options);

	fn = readDirectoryPathType(fn, pathType);

	return readDirectoryResultType(fn, returnType);
}
