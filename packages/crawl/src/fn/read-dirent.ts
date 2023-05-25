import * as fs from 'node:fs';

import type {
	CallbackReadDirectoryFn,
	CrawlerOptions,
	ReadDirectory,
	SyncReadDirectory,
} from '../types';
import { ExtendedDirent } from '../types';
import readDirectoryEmpty from './read-directory-empty';
import readDirectoryExclude from './read-directory-exclude';
import readDirectoryFilter from './read-directory-filter';
import readDirectoryPathType from './read-directory-path-type';

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

export default function readDirent(
	api: 'callback' | 'sync',
	options: CrawlerOptions
): ReadDirectory<ExtendedDirent> {
	const { excludeFiles, excludeDirectories, pathType, exclude } = options;

	if (excludeFiles === true && excludeDirectories === true) {
		return readDirectoryEmpty(api);
	}

	let fn = internalDirentReadDirectory(api);

	fn = readDirectoryExclude(fn, exclude);

	fn = readDirectoryFilter(fn, options);

	return readDirectoryPathType(fn, pathType);
}
