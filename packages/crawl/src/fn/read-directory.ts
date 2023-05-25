import type { CrawlerOptions, ReadDirectory, ResultTypeOutput } from '../types';
import readDirectoryEmpty from './read-directory-empty';
import readDirectoryResultType from './read-directory-result-type';
import readDirent from './read-dirent';

export default function readDirectory(
	api: 'callback' | 'sync',
	options: CrawlerOptions
): ReadDirectory<ResultTypeOutput> {
	const { excludeFiles, excludeDirectories, returnType } = options;

	if (excludeFiles === true && excludeDirectories === true) {
		return readDirectoryEmpty(api);
	}

	const fn = readDirent(api, options);

	return readDirectoryResultType(fn, returnType);
}
