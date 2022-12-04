import { fs } from '@hexatool/fs-file-system';

import { moveAcrossDeviceAsync, moveAcrossDeviceSync } from './move-across-device';
import type { ErrorWithCode } from './types';

export function renameSync(src: string, dest: string, overwrite?: boolean): void {
	try {
		fs.renameSync(src, dest);
	} catch (e) {
		const err = e as ErrorWithCode;
		if (err.code !== 'EXDEV') {
			throw err;
		}

		moveAcrossDeviceSync(src, dest, overwrite);

		return;
	}
}

export async function renameAsync(src: string, dest: string, overwrite?: boolean): Promise<void> {
	try {
		await fs.promises.rename(src, dest);
	} catch (e) {
		const err = e as ErrorWithCode;
		if (err.code !== 'EXDEV') {
			throw err;
		}

		await moveAcrossDeviceAsync(src, dest, overwrite);

		return;
	}
}
