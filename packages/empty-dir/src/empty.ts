import { join } from 'node:path';

import makeDirSync from '@hexatool/fs-make-dir';
import makeDirAsync from '@hexatool/fs-make-dir/async';
import removeSync from '@hexatool/fs-remove';
import removeAsync from '@hexatool/fs-remove/async';
import fs from 'node:fs';

export async function emptyDir(path: string): Promise<void> {
	let items;
	try {
		items = await fs.promises.readdir(path);
	} catch {
		await makeDirAsync(path);

		return;
	}

	await Promise.all(items.map(item => removeAsync(join(path, item))));
}

export function emptyDirSync(path: string): void {
	let items;
	try {
		items = fs.readdirSync(path);
	} catch {
		makeDirSync(path);

		return;
	}

	items.forEach(item => {
		const file = join(path, item);
		removeSync(file);
	});
}
