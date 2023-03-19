import type { CrawlerOptions, ExtendedDirent, ReadDirectory } from '../types';
import type {
	DirentExcludeItemType,
	ResultTypeOutput,
	StringExcludeItemType,
} from '../types/options';
import matchItem from './match-item';
import pathReadDirectory from './path-read-directory';

function filterDirentDirectoryAndFilesReadDir(
	api: 'callback' | 'sync',
	fn: ReadDirectory<ExtendedDirent>,
	excludeDirectories: DirentExcludeItemType,
	excludeFile: DirentExcludeItemType
): ReadDirectory<ExtendedDirent> {
	const matchDirectory = matchItem(excludeDirectories, 'Dirent');
	const matchFile = matchItem(excludeFile, 'Dirent');
	if (api === 'callback') {
		return (path, callback) => {
			fn(path, (error, result) => {
				if (error && callback) {
					callback(error, []);
				} else if (callback) {
					callback(
						undefined,
						result?.filter(d => {
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
	fn: ReadDirectory<ExtendedDirent>,
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
						undefined,
						result
							?.filter(d => {
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
	fn: ReadDirectory<ExtendedDirent>,
	excludeFile: DirentExcludeItemType
): ReadDirectory<ExtendedDirent> {
	const matchFile = matchItem(excludeFile, 'Dirent');
	if (api === 'callback') {
		return (path, callback) => {
			fn(path, (error, result) => {
				if (error && callback) {
					callback(error, []);
				} else if (callback) {
					callback(
						undefined,
						result?.filter(d => {
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
	fn: ReadDirectory<ExtendedDirent>,
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
						undefined,
						result
							?.filter(d => {
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
	fn: ReadDirectory<ExtendedDirent>,
	excludeDirectory: DirentExcludeItemType
): ReadDirectory<ExtendedDirent> {
	const matchDirectory = matchItem(excludeDirectory, 'Dirent');
	if (api === 'callback') {
		return (path, callback) => {
			fn(path, (error, result) => {
				if (error && callback) {
					callback(error, []);
				} else if (callback) {
					callback(
						undefined,
						result?.filter(d => {
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
	fn: ReadDirectory<ExtendedDirent>,
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
						undefined,
						result
							?.filter(d => {
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
	fn: ReadDirectory<ExtendedDirent>,
	options: CrawlerOptions
): ReadDirectory<ResultTypeOutput> {
	const { excludeFiles, excludeDirectories, returnType } = options;

	let returnFn: ReadDirectory<ResultTypeOutput> = fn;

	if (excludeFiles && excludeDirectories && returnType === 'string') {
		returnFn = filterStringDirectoryAndFilesReadDir(api, fn, excludeDirectories, excludeFiles);
	} else if (excludeFiles && excludeDirectories && returnType === 'Dirent') {
		returnFn = filterDirentDirectoryAndFilesReadDir(api, fn, excludeDirectories, excludeFiles);
	} else if (excludeFiles && returnType === 'Dirent') {
		returnFn = filterDirentFilesReadDir(api, fn, excludeFiles);
	} else if (excludeFiles && returnType === 'string') {
		returnFn = filterStringFilesReadDir(api, fn, excludeFiles);
	} else if (excludeDirectories && returnType === 'Dirent') {
		returnFn = filterDirentDirectoriesReadDir(api, fn, excludeDirectories);
	} else if (excludeDirectories && returnType === 'string') {
		returnFn = filterStringDirectoriesReadDir(api, fn, excludeDirectories);
	}

	return pathReadDirectory(returnFn, options);
}
