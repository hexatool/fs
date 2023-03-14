import type { Dirent } from 'node:fs';

import { fs } from '@hexatool/fs-file-system';

import type { CallBack, CrawlerOptions } from '../types';
import type {
	DirentExcludeItemType,
	ExcludeType,
	ResultTypeOutput,
	StringExcludeItemType,
} from '../types/options';
import emptyReadDirFn from './empty-read-dir';
import matchDirectory from './match-directory';
import matchItem from './match-item';

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

function filterDirentDirectoryAndFilesReadDir(
	api: 'callback' | 'sync',
	fn: ReadDirectory<Dirent>,
	excludeDirectories: DirentExcludeItemType,
	excludeFile: DirentExcludeItemType
): ReadDirectory<Dirent> {
	const matchDirectory = matchItem(excludeDirectories, 'Dirent');
	const matchFile = matchItem(excludeFile, 'Dirent');
	if (api === 'callback') {
		return (path, callback) => {
			fn(path, (error, result) => {
				if (error && callback) {
					callback(error, []);
				} else if (callback) {
					callback(
						null,
						result.filter(d => {
							if (d.isDirectory() && !matchDirectory(path, d)) {
								return true;
							}

							return d.isFile() && !matchFile(path, d);
						})
					);
				}
			});
		};
	}

	return (path: string) => {
		const files = fn(path);
		if (files) {
			return files.filter(d => {
				if (d.isDirectory() && !matchDirectory(path, d)) {
					return true;
				}

				return d.isFile() && !matchFile(path, d);
			});
		}

		return [];
	};
}

function filterStringDirectoryAndFilesReadDir(
	api: 'callback' | 'sync',
	fn: ReadDirectory<Dirent>,
	excludeDirectories: StringExcludeItemType,
	excludeFile: StringExcludeItemType
): ReadDirectory<string> {
	const matchDirectory = matchItem(excludeDirectories, 'string');
	const matchFile = matchItem(excludeFile, 'string');
	if (api === 'callback') {
		return (path, callback) => {
			fn(path, (error, result) => {
				if (error && callback) {
					callback(error, []);
				} else if (callback) {
					callback(
						null,
						result
							.filter(d => {
								if (d.isDirectory() && !matchDirectory(path, d.name)) {
									return true;
								}

								return d.isFile() && !matchFile(path, d.name);
							})
							.map(s => s.name)
					);
				}
			});
		};
	}

	return (path: string) => {
		const files = fn(path);
		if (files) {
			return files
				.filter(d => {
					if (d.isDirectory() && !matchDirectory(path, d.name)) {
						return true;
					}

					return d.isFile() && !matchFile(path, d.name);
				})
				.map(s => s.name);
		}

		return [];
	};
}

function filterDirentFilesReadDir(
	api: 'callback' | 'sync',
	fn: ReadDirectory<Dirent>,
	excludeFile: DirentExcludeItemType
): ReadDirectory<Dirent> {
	const matchFile = matchItem(excludeFile, 'Dirent');
	if (api === 'callback') {
		return (path, callback) => {
			fn(path, (error, result) => {
				if (error && callback) {
					callback(error, []);
				} else if (callback) {
					callback(
						null,
						result.filter(d => {
							if (d.isDirectory()) {
								return true;
							}

							return d.isFile() && !matchFile(path, d);
						})
					);
				}
			});
		};
	}

	return (path: string) => {
		const files = fn(path);
		if (files) {
			return files.filter(d => {
				if (d.isDirectory()) {
					return true;
				}

				return d.isFile() && !matchFile(path, d);
			});
		}

		return [];
	};
}

function filterStringFilesReadDir(
	api: 'callback' | 'sync',
	fn: ReadDirectory<Dirent>,
	excludeFile: StringExcludeItemType
): ReadDirectory<string> {
	const matchFile = matchItem(excludeFile, 'string');
	if (api === 'callback') {
		return (path, callback) => {
			fn(path, (error, result) => {
				if (error && callback) {
					callback(error, []);
				} else if (callback) {
					callback(
						null,
						result
							.filter(d => {
								if (d.isDirectory()) {
									return true;
								}

								return d.isFile() && !matchFile(path, d.name);
							})
							.map(s => s.name)
					);
				}
			});
		};
	}

	return (path: string) => {
		const files = fn(path);
		if (files) {
			return files
				.filter(d => {
					if (d.isDirectory()) {
						return true;
					}

					return d.isFile() && !matchFile(path, d.name);
				})
				.map(s => s.name);
		}

		return [];
	};
}

function filterDirentDirectoriesReadDir(
	api: 'callback' | 'sync',
	fn: ReadDirectory<Dirent>,
	excludeDirectory: DirentExcludeItemType
): ReadDirectory<Dirent> {
	const matchDirectory = matchItem(excludeDirectory, 'Dirent');
	if (api === 'callback') {
		return (path, callback) => {
			fn(path, (error, result) => {
				if (error && callback) {
					callback(error, []);
				} else if (callback) {
					callback(
						null,
						result.filter(d => {
							if (d.isFile()) {
								return true;
							}

							return d.isDirectory() && !matchDirectory(path, d);
						})
					);
				}
			});
		};
	}

	return (path: string) => {
		const files = fn(path);
		if (files) {
			return files.filter(d => {
				if (d.isFile()) {
					return true;
				}

				return d.isDirectory() && !matchDirectory(path, d);
			});
		}

		return [];
	};
}

function filterStringDirectoriesReadDir(
	api: 'callback' | 'sync',
	fn: ReadDirectory<Dirent>,
	excludeDirectory: StringExcludeItemType
): ReadDirectory<string> {
	const matchDirectory = matchItem(excludeDirectory, 'string');
	if (api === 'callback') {
		return (path, callback) => {
			fn(path, (error, result) => {
				if (error && callback) {
					callback(error, []);
				} else if (callback) {
					callback(
						null,
						result
							.filter(d => {
								if (d.isFile()) {
									return true;
								}

								return d.isDirectory() && !matchDirectory(path, d.name);
							})
							.map(s => s.name)
					);
				}
			});
		};
	}

	return (path: string) => {
		const files = fn(path);
		if (files) {
			return files
				.filter(d => {
					if (d.isFile()) {
						return true;
					}

					return d.isDirectory() && !matchDirectory(path, d.name);
				})
				.map(s => s.name);
		}

		return [];
	};
}

export default function readDirectory(
	api: 'callback' | 'sync',
	options: CrawlerOptions
): ReadDirectory<ResultTypeOutput> {
	const { excludeFiles, excludeDirectories, returnType } = options;

	if (excludeFiles === true && excludeDirectories === true) {
		return emptyReadDirFn(api);
	}
	if (excludeFiles === undefined && excludeDirectories === undefined) {
		return internalReadDirectory(api, options);
	}

	const fn = internalDirentReadDirectory(api, options);

	if (excludeFiles && excludeDirectories && returnType === 'string') {
		return filterStringDirectoryAndFilesReadDir(api, fn, excludeDirectories, excludeFiles);
	}
	if (excludeFiles && excludeDirectories && returnType === 'Dirent') {
		return filterDirentDirectoryAndFilesReadDir(api, fn, excludeDirectories, excludeFiles);
	}
	if (excludeFiles && returnType === 'Dirent') {
		return filterDirentFilesReadDir(api, fn, excludeFiles);
	}
	if (excludeFiles && returnType === 'string') {
		return filterStringFilesReadDir(api, fn, excludeFiles);
	}
	if (excludeDirectories && returnType === 'Dirent') {
		return filterDirentDirectoriesReadDir(api, fn, excludeDirectories);
	}
	if (excludeDirectories && returnType === 'string') {
		return filterStringDirectoriesReadDir(api, fn, excludeDirectories);
	}

	return fn;
}
