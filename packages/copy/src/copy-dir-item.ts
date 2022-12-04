import path from 'node:path';

import { checkPaths as checkPathsSync } from '@hexatool/fs-stat';
import { checkPaths as checkPathsAsync } from '@hexatool/fs-stat/async';

import { internalCopyAsync, internalCopySync } from './internal-copy';
import type { CopyOptions } from './types';

export function copyDirItemSync(item: string, src: string, dest: string, opts: CopyOptions): void {
	const srcItem = path.join(src, item);
	const destItem = path.join(dest, item);
	if (opts.filter && !opts.filter(srcItem, destItem)) {
		return;
	}
	const { destStat } = checkPathsSync(srcItem, destItem, 'copy', opts);
	internalCopySync(destStat, srcItem, destItem, opts);
}

export async function copyDirItemAsync(
	item: string,
	src: string,
	dest: string,
	opts: CopyOptions
): Promise<void> {
	const srcItem = path.join(src, item);
	const destItem = path.join(dest, item);
	if (opts.filter && !opts.filter(srcItem, destItem)) {
		return;
	}
	const { destStat } = await checkPathsAsync(srcItem, destItem, 'copy', opts);
	await internalCopyAsync(destStat, srcItem, destItem, opts);
}
