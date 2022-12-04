import { fs } from '@hexatool/fs-file-system';

import { utimesMillisAsync, utimesMillisSync } from './utimes';

export function setDestTimestampsSync(src: string, dest: string): void {
	// The initial srcStat.atime cannot be trusted
	// because it is modified by the read(2) system call
	// (See https://nodejs.org/api/fs.html#fs_stat_time_values)
	const updatedSrcStat = fs.statSync(src);
	utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
}

export async function setDestTimestampsAsync(src: string, dest: string): Promise<void> {
	// The initial srcStat.atime cannot be trusted
	// because it is modified by the read(2) system call
	// (See https://nodejs.org/api/fs.html#fs_stat_time_values)
	const updatedSrcStat = await fs.promises.stat(src);
	await utimesMillisAsync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
}
