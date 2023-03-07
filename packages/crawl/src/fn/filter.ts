import type { Dirent } from 'node:fs';

import type { CallBack } from '../types';
import type { ExcludeDirentType, ExcludeType } from '../types/options';
import { emptyReaDir, matchExclude } from './exclude-utils';
import type { ReadDirFn } from './read-dir';

function filterDirectories(
	readDir: ReadDirFn<Dirent>,
	exclude: ExcludeDirentType
): ReadDirFn<Dirent> {
	const excludeFolderFn = exclude === true ? () => true : matchExclude(exclude);

	return (path: string, callback?: CallBack<Dirent[]>): Dirent[] | void => {
		if (callback) {
			return readDir(path, (error, result) => {
				if (error) {
					callback(error, result);
				} else {
					callback(
						error,
						result.filter(d => {
							if (d.isDirectory()) {
								return !excludeFolderFn(d.name, exclude as ExcludeType);
							}

							return d.isFile();
						})
					);
				}
			});
		}
		const dirents = readDir(path);
		if (dirents) {
			return dirents.filter(d => {
				if (d.isDirectory()) {
					return !excludeFolderFn(d.name, exclude as ExcludeType);
				}

				return d.isFile();
			});
		}
	};
}

function filterFiles(readDir: ReadDirFn<Dirent>, exclude: ExcludeDirentType): ReadDirFn<Dirent> {
	const excludeFileFn = exclude === true ? () => true : matchExclude(exclude);

	return (path: string, callback?: CallBack<Dirent[]>): Dirent[] | void => {
		if (callback) {
			return readDir(path, (error, result) => {
				if (error) {
					callback(error, result);
				} else {
					callback(
						error,
						result.filter(d => {
							if (d.isFile()) {
								return !excludeFileFn(d.name, exclude as ExcludeType);
							}

							return d.isDirectory();
						})
					);
				}
			});
		}
		const dirents = readDir(path);
		if (dirents) {
			return dirents.filter(d => {
				if (d.isFile()) {
					return !excludeFileFn(d.name, exclude as ExcludeType);
				}

				return d.isDirectory();
			});
		}
	};
}

function filter(
	readDir: ReadDirFn<Dirent>,
	excludeFolders: ExcludeDirentType,
	excludeFiles: ExcludeDirentType
): ReadDirFn<Dirent> {
	const excludeFolderFn = excludeFolders === true ? () => true : matchExclude(excludeFolders);
	const excludeFileFn = excludeFiles === true ? () => true : matchExclude(excludeFiles);

	return (path: string, callback?: CallBack<Dirent[]>): Dirent[] | void => {
		if (callback) {
			return readDir(path, (error, result) => {
				if (error) {
					callback(error, result);
				} else {
					callback(
						error,
						result.filter(d => {
							if (d.isFile()) {
								return !excludeFileFn(d.name, excludeFiles as ExcludeType);
							}
							if (d.isDirectory()) {
								return !excludeFolderFn(d.name, excludeFolders as ExcludeType);
							}

							return false;
						})
					);
				}
			});
		}
		const dirents = readDir(path);
		if (dirents) {
			return dirents.filter(d => {
				if (d.isFile()) {
					return !excludeFileFn(d.name, excludeFiles as ExcludeType);
				}
				if (d.isDirectory()) {
					return !excludeFolderFn(d.name, excludeFolders as ExcludeType);
				}

				return false;
			});
		}
	};
}

function defaultFn(readDir: ReadDirFn<Dirent>): ReadDirFn<Dirent> {
	return (path: string, callback?: CallBack<Dirent[]>): Dirent[] | void => {
		if (callback) {
			return readDir(path, (error, result) => {
				if (error) {
					callback(error, result);
				} else {
					callback(
						error,
						result.filter(d => d.isDirectory() || d.isFile())
					);
				}
			});
		}
		const dirents = readDir(path);
		if (dirents) {
			return dirents.filter(d => d.isDirectory() || d.isFile());
		}
	};
}

export default function filterFn<Exclude extends ExcludeDirentType, Fn extends ReadDirFn<Dirent>>(
	readDir: Fn,
	excludeFolders?: Exclude,
	excludeFiles?: Exclude
): Fn {
	if (excludeFolders === true && excludeFiles === true) {
		return emptyReaDir as Fn;
	}
	if (excludeFolders === undefined && excludeFiles === undefined) {
		return defaultFn(readDir) as Fn;
	}
	if (excludeFolders !== undefined && excludeFiles !== undefined) {
		return filter(readDir, excludeFolders, excludeFiles) as Fn;
	}
	if (excludeFolders) {
		return filterDirectories(readDir, excludeFolders) as Fn;
	}

	return filterFiles(readDir, excludeFiles as ExcludeDirentType) as Fn;
}
