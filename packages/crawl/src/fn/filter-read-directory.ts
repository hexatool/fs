import type { Dirent } from 'node:fs';

import type { CrawlerOptions } from '../types';
import type {
	DirentExcludeItemType,
	ResultTypeOutput,
	StringExcludeItemType,
} from '../types/options';
import matchItem from './match-item';
import type { ReadDirectory } from './read-directory';

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

export default function filterReadDirectory(
	api: 'callback' | 'sync',
	fn: ReadDirectory<Dirent>,
	options: CrawlerOptions
): ReadDirectory<ResultTypeOutput> {
	const { excludeFiles, excludeDirectories, returnType } = options;

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
