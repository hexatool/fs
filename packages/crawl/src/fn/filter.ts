import type { Dirent } from 'node:fs';

import type { CallBack } from '../types';
import type { ExcludeDirentType, ExcludeType } from '../types/options';
import { emptyReaDir, matchExclude } from './exclude-utils';
import type { ReadDirFn } from './read-dir';

function excludeFolderReaDir(readDir: ReadDirFn<Dirent>, exclude: ExcludeType): ReadDirFn<Dirent> {
	const excludeFolderFn = matchExclude(exclude);

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
								return !excludeFolderFn(d.name, exclude);
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
					return !excludeFolderFn(d.name, exclude);
				}

				return d.isFile();
			});
		}
	};
}

function excludeFileReaDir(readDir: ReadDirFn<Dirent>, exclude: ExcludeType): ReadDirFn<Dirent> {
	const excludeFileFn = matchExclude(exclude);

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
								return !excludeFileFn(d.name, exclude);
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
					return !excludeFileFn(d.name, exclude);
				}

				return d.isDirectory();
			});
		}
	};
}

function excludeFolderAndFileReaDir(
	readDir: ReadDirFn<Dirent>,
	excludeFolders: ExcludeType,
	excludeFiles: ExcludeType
): ReadDirFn<Dirent> {
	const excludeFolderFn = matchExclude(excludeFolders);
	const excludeFileFn = matchExclude(excludeFiles);

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
								return !excludeFileFn(d.name, excludeFiles);
							}
							if (d.isDirectory()) {
								return !excludeFolderFn(d.name, excludeFolders);
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
					return !excludeFileFn(d.name, excludeFiles);
				}
				if (d.isDirectory()) {
					return !excludeFolderFn(d.name, excludeFolders);
				}

				return false;
			});
		}
	};
}

function defaultReadDir(readDir: ReadDirFn<Dirent>): ReadDirFn<Dirent> {
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
		return defaultReadDir(readDir) as Fn;
	}
	if (excludeFolders !== undefined && excludeFiles !== undefined) {
		return excludeFolderAndFileReaDir(
			readDir,
			excludeFolders as ExcludeType,
			excludeFiles as ExcludeType
		) as Fn;
	}
	if (excludeFolders) {
		return excludeFolderReaDir(readDir, excludeFolders as ExcludeType) as Fn;
	}

	return excludeFileReaDir(readDir, excludeFiles as ExcludeType) as Fn;
}
