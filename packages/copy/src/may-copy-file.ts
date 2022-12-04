import type { BigIntStats, Stats } from 'node:fs';

import { fs } from '@hexatool/fs-file-system';

import { copyFileAsync, copyFileSync } from './copy-file';
import type { CopyOptions } from './types';

export function mayCopyFileSync(
	srcStat: BigIntStats | Stats,
	src: string,
	dest: string,
	opts: CopyOptions
): void {
	if (opts.overwrite) {
		fs.unlinkSync(dest);

		copyFileSync(srcStat, src, dest, opts);

		return;
	}
	if (opts.errorOnExist) {
		throw new Error(`'${dest}' already exists`);
	}
}

export async function mayCopyFileAsync(
	srcStat: BigIntStats | Stats,
	src: string,
	dest: string,
	opts: CopyOptions
): Promise<void> {
	if (opts.overwrite) {
		await fs.promises.unlink(dest);

		await copyFileAsync(srcStat, src, dest, opts);

		return;
	}
	if (opts.errorOnExist) {
		throw new Error(`'${dest}' already exists`);
	}
}
