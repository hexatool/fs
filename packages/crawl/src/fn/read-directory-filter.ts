import type { CrawlerOptions, ExtendedDirent, ReadDirectory } from '../types';
import type { DirentExcludeItemType, StringExcludeItemType } from '../types/options';
import readDirectoryInterceptor from '../utils/read-directory-interceptor';
import matchItem from './match-item';

function filterDirentDirectoryAndFilesReadDir(
	fn: ReadDirectory<ExtendedDirent>,
	excludeDirectories: DirentExcludeItemType,
	excludeFile: DirentExcludeItemType
): ReadDirectory<ExtendedDirent> {
	const matchDirectory = matchItem(excludeDirectories, 'Dirent');
	const matchFile = matchItem(excludeFile, 'Dirent');

	return readDirectoryInterceptor(fn, (path, result) =>
		result.filter(d => {
			if (d.isDirectory() && !matchDirectory(path, d)) {
				return true;
			}

			return d.isFile() && !matchFile(path, d);
		})
	);
}

function filterStringDirectoryAndFilesReadDir(
	fn: ReadDirectory<ExtendedDirent>,
	excludeDirectories: StringExcludeItemType,
	excludeFile: StringExcludeItemType
): ReadDirectory<ExtendedDirent> {
	const matchDirectory = matchItem(excludeDirectories, 'string');
	const matchFile = matchItem(excludeFile, 'string');

	return readDirectoryInterceptor(fn, (path, result) =>
		result.filter(d => {
			if (d.isDirectory() && !matchDirectory(path, d.name)) {
				return true;
			}

			return d.isFile() && !matchFile(path, d.name);
		})
	);
}

function filterDirentFilesReadDir(
	fn: ReadDirectory<ExtendedDirent>,
	excludeFile: DirentExcludeItemType
): ReadDirectory<ExtendedDirent> {
	const matchFile = matchItem(excludeFile, 'Dirent');

	return readDirectoryInterceptor(fn, (path, result) =>
		result.filter(d => {
			if (d.isDirectory()) {
				return true;
			}

			return d.isFile() && !matchFile(path, d);
		})
	);
}

function filterStringFilesReadDir(
	fn: ReadDirectory<ExtendedDirent>,
	excludeFile: StringExcludeItemType
): ReadDirectory<ExtendedDirent> {
	const matchFile = matchItem(excludeFile, 'string');

	return readDirectoryInterceptor(fn, (path, result) =>
		result.filter(d => {
			if (d.isDirectory()) {
				return true;
			}

			return d.isFile() && !matchFile(path, d.name);
		})
	);
}

function filterDirentDirectoriesReadDir(
	fn: ReadDirectory<ExtendedDirent>,
	excludeDirectory: DirentExcludeItemType
): ReadDirectory<ExtendedDirent> {
	const matchDirectory = matchItem(excludeDirectory, 'Dirent');

	return readDirectoryInterceptor(fn, (path, result) =>
		result.filter(d => {
			if (d.isFile()) {
				return true;
			}

			return d.isDirectory() && !matchDirectory(path, d);
		})
	);
}

function filterStringDirectoriesReadDir(
	fn: ReadDirectory<ExtendedDirent>,
	excludeDirectory: StringExcludeItemType
): ReadDirectory<ExtendedDirent> {
	const matchDirectory = matchItem(excludeDirectory, 'string');

	return readDirectoryInterceptor(fn, (path, result) =>
		result.filter(d => {
			if (d.isFile()) {
				return true;
			}

			return d.isDirectory() && !matchDirectory(path, d.name);
		})
	);
}

export default function readDirectoryFilter(
	fn: ReadDirectory<ExtendedDirent>,
	options: CrawlerOptions
): ReadDirectory<ExtendedDirent> {
	const { excludeFiles, excludeDirectories, returnType } = options;

	if (excludeFiles && excludeDirectories && returnType === 'string') {
		return filterStringDirectoryAndFilesReadDir(fn, excludeDirectories, excludeFiles);
	}
	if (excludeFiles && excludeDirectories && returnType === 'Dirent') {
		return filterDirentDirectoryAndFilesReadDir(fn, excludeDirectories, excludeFiles);
	}
	if (excludeFiles && returnType === 'Dirent') {
		return filterDirentFilesReadDir(fn, excludeFiles);
	}
	if (excludeFiles && returnType === 'string') {
		return filterStringFilesReadDir(fn, excludeFiles);
	}
	if (excludeDirectories && returnType === 'Dirent') {
		return filterDirentDirectoriesReadDir(fn, excludeDirectories);
	}
	if (excludeDirectories && returnType === 'string') {
		return filterStringDirectoriesReadDir(fn, excludeDirectories);
	}

	return fn;
}
