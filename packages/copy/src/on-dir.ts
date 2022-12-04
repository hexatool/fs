import type { BigIntStats, Stats } from 'node:fs';

import { copyDirAsync, copyDirSync } from './copy-dir';
import { makeDirectoryAndCopyAsync, makeDirectoryAndCopySync } from './make-dir-and-copy';
import type { CopyOptions } from './types';

export function onDirSync(
	srcStat: BigIntStats | Stats,
	destStat: BigIntStats | Stats | undefined,
	src: string,
	dest: string,
	opts: CopyOptions
): void {
	if (!destStat) {
		makeDirectoryAndCopySync(srcStat.mode, src, dest, opts);

		return;
	}
	copyDirSync(src, dest, opts);
}

export async function onDirAsync(
	srcStat: BigIntStats | Stats,
	destStat: BigIntStats | Stats | undefined,
	src: string,
	dest: string,
	opts: CopyOptions
): Promise<void> {
	if (!destStat) {
		return makeDirectoryAndCopyAsync(srcStat.mode, src, dest, opts);
	}
	await copyDirAsync(src, dest, opts);
}
