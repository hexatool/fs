import type { CrawlDirection } from '../options';
import joinDirectoryPath from './join-directory-path';

function nextUpDirectoryPath(directoryPath: string, filename: string): string {
	// return path.dirname(directoryPath);
	return joinDirectoryPath(filename, directoryPath);
}

function nextDownDirectoryPath(directoryPath: string, filename: string): string {
	return joinDirectoryPath(filename, directoryPath);
}

export type NextDirectoryPathFunction = (directoryPath: string, filename: string) => string;

export default function (direction: CrawlDirection): NextDirectoryPathFunction {
	return direction === 'up' ? nextUpDirectoryPath : nextDownDirectoryPath;
}
