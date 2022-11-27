import { fs } from '@hexatool/fs-file-system';

import { rmkids, rmkidsSync } from './rmkids';
import type { ErrorWithCode } from './types';

export function rmdirSync(path: string, originalEr?: Error): void {
	try {
		fs.rmdirSync(path);
	} catch (e: unknown) {
		const err = e as ErrorWithCode;
		if (err.code === 'ENOTDIR') {
			throw originalEr;
		} else if (err.code === 'ENOTEMPTY' || err.code === 'EEXIST' || err.code === 'EPERM') {
			rmkidsSync(path);
		} else if (err.code !== 'ENOENT') {
			throw err;
		}
	}
}

export async function rmdir(path: string, originalEr?: Error): Promise<void> {
	try {
		await fs.promises.rmdir(path);
	} catch (e: unknown) {
		const err = e as ErrorWithCode;
		if (err.code === 'ENOTDIR') {
			throw originalEr;
		} else if (err.code === 'ENOTEMPTY' || err.code === 'EEXIST' || err.code === 'EPERM') {
			await rmkids(path);
		} else if (err.code !== 'ENOENT') {
			throw err;
		}
	}
}
