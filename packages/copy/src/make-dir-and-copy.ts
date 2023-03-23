import * as fs from 'node:fs';

import { copyDirAsync, copyDirSync } from './copy-dir';
import { setDestModeAsync, setDestModeSync } from './set-dest-mode';
import type { CopyOptions } from './types';

export function makeDirectoryAndCopySync(
	srcMode: bigint | number,
	src: string,
	dest: string,
	opts: CopyOptions
): void {
	fs.mkdirSync(dest);
	copyDirSync(src, dest, opts);
	setDestModeSync(dest, srcMode);
}

export async function makeDirectoryAndCopyAsync(
	srcMode: bigint | number,
	src: string,
	dest: string,
	opts: CopyOptions
): Promise<void> {
	await fs.promises.mkdir(dest);
	await copyDirAsync(src, dest, opts);
	await setDestModeAsync(dest, srcMode);
}
