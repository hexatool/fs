import type { Stats } from 'node:fs';

import { fs } from '@hexatool/fs-file-system';

import type { CrawlerState } from '../crawler';
import type { CrawlerOptions } from '../options';

export type ResolveSymlinkFunction = (
	path: string,
	state: CrawlerState,
	callback: (stat: Stats, path: string) => void
) => void;

const resolveSymlinksAsync: ResolveSymlinkFunction = function (path, state, callback) {
	const {
		options: { suppressErrors },
	} = state;
	state.queue.enqueue();

	fs.realpath(path, (error, resolvedPath) => {
		if (error) {
			state.queue.dequeue(suppressErrors ? undefined : error, state);

			return;
		}

		fs.lstat(resolvedPath, (_error, stat) => {
			callback(stat, resolvedPath);

			state.queue.dequeue(undefined, state);
		});
	});
};

const resolveSymlinksSync: ResolveSymlinkFunction = function (path, state, callback) {
	try {
		const resolvedPath = fs.realpathSync(path);
		const stat = fs.lstatSync(resolvedPath);
		callback(stat, resolvedPath);
	} catch (e) {
		if (!state.options.suppressErrors) {
			throw e;
		}
	}
};

export default function (
	options: CrawlerOptions,
	isSynchronous: boolean
): ResolveSymlinkFunction | undefined {
	if (!options.resolveSymlinks) {
		return undefined;
	}

	return isSynchronous ? resolveSymlinksSync : resolveSymlinksAsync;
}
