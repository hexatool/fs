import type { BigIntStats, Stats } from 'node:fs';
import * as fs from 'node:fs';

import { handleTimestampsAsync, handleTimestampsSync } from './handle-timestamps';
import { setDestModeAsync, setDestModeSync } from './set-dest-mode';
import type { CopyOptions } from './types';

export function copyFileSync(
	srcStat: BigIntStats | Stats,
	src: string,
	dest: string,
	opts: CopyOptions
): void {
	fs.copyFileSync(src, dest);
	if (opts.preserveTimestamps) {
		handleTimestampsSync(srcStat.mode, src, dest);
	}
	setDestModeSync(dest, srcStat.mode);
}

export async function copyFileAsync(
	srcStat: BigIntStats | Stats,
	src: string,
	dest: string,
	opts: CopyOptions
): Promise<void> {
	await fs.promises.copyFile(src, dest);
	if (opts.preserveTimestamps) {
		await handleTimestampsAsync(srcStat.mode, src, dest);
	}
	await setDestModeAsync(dest, srcStat.mode);
}
