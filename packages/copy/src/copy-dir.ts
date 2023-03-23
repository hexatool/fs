import * as fs from 'node:fs';

import { copyDirItemAsync, copyDirItemSync } from './copy-dir-item';
import type { CopyOptions } from './types';

export function copyDirSync(src: string, dest: string, opts: CopyOptions): void {
	fs.readdirSync(src).forEach(item => {
		copyDirItemSync(item, src, dest, opts);
	});
}

export async function copyDirAsync(src: string, dest: string, opts: CopyOptions): Promise<void> {
	const files = await fs.promises.readdir(src);
	const promises = files.map(item => copyDirItemAsync(item, src, dest, opts));
	await Promise.all(promises);
}
