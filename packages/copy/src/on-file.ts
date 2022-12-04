import type { BigIntStats, Stats } from 'node:fs';

import { copyFileAsync, copyFileSync } from './copy-file';
import { mayCopyFileAsync, mayCopyFileSync } from './may-copy-file';
import type { CopyOptions } from './types';

export function onFileSync(
	srcStat: BigIntStats | Stats,
	destStat: BigIntStats | Stats | undefined,
	src: string,
	dest: string,
	opts: CopyOptions
): void {
	if (!destStat) {
		copyFileSync(srcStat, src, dest, opts);
	}
	mayCopyFileSync(srcStat, src, dest, opts);
}

export async function onFileAsync(
	srcStat: BigIntStats | Stats,
	destStat: BigIntStats | Stats | undefined,
	src: string,
	dest: string,
	opts: CopyOptions
): Promise<void> {
	if (!destStat) {
		return copyFileAsync(srcStat, src, dest, opts);
	}
	await mayCopyFileAsync(srcStat, src, dest, opts);
}
