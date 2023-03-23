import type { BigIntStats, Stats } from 'node:fs';
import * as fs from 'node:fs';
import path from 'node:path';

import { isSrcSubdirectory } from '@hexatool/fs-stat';

import { copyLinkAsync, copyLinkSync } from './copy-link';
import type { CopyOptions, ErrorWithCode } from './types';

export function onLinkSync(
	destStat: BigIntStats | Stats | undefined,
	src: string,
	dest: string,
	opts: CopyOptions
): void {
	let resolvedSrc = fs.readlinkSync(src);
	if (opts.dereference) {
		resolvedSrc = path.resolve(process.cwd(), resolvedSrc);
	}

	if (!destStat) {
		fs.symlinkSync(resolvedSrc, dest);

		return;
	}
	let resolvedDest;
	try {
		resolvedDest = fs.readlinkSync(dest);
	} catch (e) {
		const err = e as ErrorWithCode;
		// dest exists and is a regular file or directory,
		// Windows may throw UNKNOWN error. If dest already exists,
		// fs throws error anyway, so no need to guard against it here.
		if (err.code === 'EINVAL' || err.code === 'UNKNOWN') {
			fs.symlinkSync(resolvedSrc, dest);

			return;
		}
		throw err;
	}
	if (opts.dereference) {
		resolvedDest = path.resolve(process.cwd(), resolvedDest);
	}
	if (isSrcSubdirectory(resolvedSrc, resolvedDest)) {
		throw new Error(
			`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`
		);
	}

	// prevent copy if src is a subdir of dest since unlinking
	// dest in this case would result in removing src contents
	// and therefore a broken symlink would be created.
	if (isSrcSubdirectory(resolvedDest, resolvedSrc)) {
		throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
	}

	copyLinkSync(resolvedSrc, dest);
}

export async function onLinkAsync(
	destStat: BigIntStats | Stats | undefined,
	src: string,
	dest: string,
	opts: CopyOptions
): Promise<void> {
	let resolvedSrc = await fs.promises.readlink(src);
	if (opts.dereference) {
		resolvedSrc = path.resolve(process.cwd(), resolvedSrc);
	}

	if (!destStat) {
		await fs.promises.symlink(resolvedSrc, dest);
	} else {
		let resolvedDest;
		try {
			resolvedDest = await fs.promises.readlink(dest);
		} catch (e) {
			const err = e as ErrorWithCode;
			// dest exists and is a regular file or directory,
			// Windows may throw UNKNOWN error. If dest already exists,
			// fs throws error anyway, so no need to guard against it here.
			if (err.code === 'EINVAL' || err.code === 'UNKNOWN') {
				return fs.promises.symlink(resolvedSrc, dest);
			}
			throw err;
		}
		if (opts.dereference) {
			resolvedDest = path.resolve(process.cwd(), resolvedDest);
		}
		if (isSrcSubdirectory(resolvedSrc, resolvedDest)) {
			throw new Error(
				`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`
			);
		}

		// prevent copy if src is a subdir of dest since unlinking
		// dest in this case would result in removing src contents
		// and therefore a broken symlink would be created.
		if (isSrcSubdirectory(resolvedDest, resolvedSrc)) {
			throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
		}
		await copyLinkAsync(resolvedSrc, dest);
	}
}
