import type { BigIntStats, Stats } from 'node:fs';

import { fs } from '@hexatool/fs-file-system';

import { onDirAsync, onDirSync } from './on-dir';
import { onFileAsync, onFileSync } from './on-file';
import { onLinkAsync, onLinkSync } from './on-link';
import type { CopyOptions } from './types';

export function internalCopySync(
	destStat: BigIntStats | Stats | undefined,
	src: string,
	dest: string,
	opts: CopyOptions
): void {
	const statSync = opts.dereference ? fs.statSync : fs.lstatSync;
	const srcStat = statSync(src);

	if (srcStat.isDirectory()) {
		onDirSync(srcStat, destStat, src, dest, opts);

		return;
	}
	if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) {
		onFileSync(srcStat, destStat, src, dest, opts);

		return;
	}
	if (srcStat.isSymbolicLink()) {
		onLinkSync(destStat, src, dest, opts);

		return;
	}
	if (srcStat.isSocket()) {
		throw new Error(`Cannot copy a socket file: ${src}`);
	} else if (srcStat.isFIFO()) {
		throw new Error(`Cannot copy a FIFO pipe: ${src}`);
	}
	throw new Error(`Unknown file: ${src}`);
}

export async function internalCopyAsync(
	destStat: BigIntStats | Stats | undefined,
	src: string,
	dest: string,
	opts: CopyOptions
): Promise<void> {
	const statSync = opts.dereference ? fs.promises.stat : fs.promises.lstat;
	const srcStat = await statSync(src);

	if (srcStat.isDirectory()) {
		return onDirAsync(srcStat, destStat, src, dest, opts);
	}
	if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) {
		return onFileAsync(srcStat, destStat, src, dest, opts);
	}
	if (srcStat.isSymbolicLink()) {
		return onLinkAsync(destStat, src, dest, opts);
	}
	if (srcStat.isSocket()) {
		throw new Error(`Cannot copy a socket file: ${src}`);
	} else if (srcStat.isFIFO()) {
		throw new Error(`Cannot copy a FIFO pipe: ${src}`);
	}
	throw new Error(`Unknown file: ${src}`);
}
