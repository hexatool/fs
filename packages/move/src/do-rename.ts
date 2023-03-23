import * as fs from 'node:fs';

import removeSync from '@hexatool/fs-remove';
import removeAsync from '@hexatool/fs-remove/async';

import { renameAsync, renameSync } from './rename';

export function doRenameSync(
	src: string,
	dest: string,
	overwrite?: boolean,
	isChangingCase?: boolean
): void {
	if (isChangingCase) {
		renameSync(src, dest, overwrite);

		return;
	}
	if (overwrite) {
		removeSync(dest);

		renameSync(src, dest, overwrite);

		return;
	}
	if (fs.existsSync(dest)) {
		throw new Error('dest already exists.');
	}

	renameSync(src, dest, overwrite);
}

export async function doRenameAsync(
	src: string,
	dest: string,
	overwrite?: boolean,
	isChangingCase?: boolean
): Promise<void> {
	if (isChangingCase) {
		await renameAsync(src, dest, overwrite);

		return;
	}
	if (overwrite) {
		await removeAsync(dest);

		await renameAsync(src, dest, overwrite);

		return;
	}
	if (fs.existsSync(dest)) {
		throw new Error('dest already exists.');
	}

	await renameAsync(src, dest, overwrite);
}
