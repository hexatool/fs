import { randomBytes } from 'node:crypto';
import path from 'node:path';

import makeDirSync from '@hexatool/fs-make-dir';
import makeDirAsync from '@hexatool/fs-make-dir/async';

import tempDir from './temp';

function uniqueString() {
	return randomBytes(32).toString('hex');
}

export async function temporaryDirAsync(prefix = ''): Promise<string> {
	const directory = path.join(tempDir, prefix + uniqueString());
	await makeDirAsync(directory);

	return directory;
}

export function temporaryDirSync(prefix = ''): string {
	const directory = path.join(tempDir, prefix + uniqueString());
	makeDirSync(directory);

	return directory;
}
