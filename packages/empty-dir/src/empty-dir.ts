import { join } from 'node:path';

import makeDirSync from '@hexatool/fs-make-dir';
import makeDirAsync from '@hexatool/fs-make-dir/async';
import removeSync from '@hexatool/fs-remove';
import removeAsync from '@hexatool/fs-remove/async';

import type { EmptyDirOptionsOrSettings } from './settings';
import { EmptyDirSettings } from './settings';

export async function emptyDirAsync(
	path: string,
	optionsOrSettings: EmptyDirOptionsOrSettings = {}
): Promise<void> {
	const { fs } = EmptyDirSettings.getSettings(optionsOrSettings);
	let items;
	try {
		items = await fs.readdir(path);
	} catch {
		await makeDirAsync(path, { fs });

		return;
	}

	await Promise.all(items.map(item => removeAsync(join(path, item), { fs })));
}

export function emptyDirSync(
	path: string,
	optionsOrSettings: EmptyDirOptionsOrSettings = {}
): void {
	const { fs } = EmptyDirSettings.getSettings(optionsOrSettings);
	let items;
	try {
		items = fs.readdirSync(path);
	} catch {
		makeDirSync(path, { fs });

		return;
	}

	items.forEach(item => {
		const file = join(path, item);
		removeSync(file, { fs });
	});
}
