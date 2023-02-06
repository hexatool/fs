import type { Dirent } from 'node:fs';

import { fs } from '@hexatool/fs-file-system';

import type { CrawlerState } from '../crawler';

export type WalkDirectoryFunction = (
	state: CrawlerState,
	directoryPath: string,
	depth: number,
	callback: (entries: Dirent[], directoryPath: string, depth: number) => void
) => void;

const readdirOpts = { withFileTypes: true } as const;

const walkAsync: WalkDirectoryFunction = (state, directoryPath, currentDepth, callback) => {
	state.queue.enqueue();

	if (currentDepth < 0) {
		state.queue.dequeue(undefined, state);

		return;
	}

	// Perf: Node >= 10 introduced withFileTypes that helps us
	// skip an extra fs.stat call.
	// However, since this API is not availble in Node < 10, I had to create
	// a compatibility layer to support both variants.
	fs.readdir(directoryPath, readdirOpts, function process(error, entries = []) {
		callback(entries, directoryPath, currentDepth);

		state.queue.dequeue(state.options.suppressErrors ? undefined : error ?? undefined, state);
	});
};

const walkSync: WalkDirectoryFunction = (state, directoryPath, currentDepth, callback) => {
	if (currentDepth < 0) {
		return;
	}

	let entries: Dirent[] = [];
	try {
		entries = fs.readdirSync(directoryPath, readdirOpts);
	} catch (e) {
		if (!state.options.suppressErrors) {
			throw e;
		}
	}
	callback(entries, directoryPath, currentDepth);
};

export default function (isSynchronous: boolean): WalkDirectoryFunction {
	return isSynchronous ? walkSync : walkAsync;
}
