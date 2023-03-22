import path from 'node:path';

import { fs } from '@hexatool/fs-file-system';
import makeDirAsync from '@hexatool/fs-make-dir/async';
import {
	checkParentPaths as checkParentPathsAsync,
	checkPaths as checkPathsAsync,
} from '@hexatool/fs-stat-util/async';

import DEFAULT_OPTIONS from './default';
import { internalCopyAsync } from './internal-copy';
import type { CopyOptions } from './types';

export default async function copy(
	src: string,
	dest: string,
	opts: CopyOptions = DEFAULT_OPTIONS
): Promise<void> {
	// Warn about using preserveTimestamps on 32-bit node
	if (opts.preserveTimestamps && process.arch === 'ia32') {
		process.emitWarning(
			'Using the preserveTimestamps option in 32-bit node is not recommended;\n\n' +
				'\tsee https://github.com/jprichardson/node-fs-extra/issues/269',
			'Warning',
			'hexatool-WARN0002'
		);
	}

	const { srcStat, destStat } = await checkPathsAsync(src, dest, 'copy', opts);
	await checkParentPathsAsync(src, srcStat, dest, 'copy');

	if (opts.filter && !opts.filter(src, dest)) {
		return;
	}
	const destParent = path.dirname(dest);
	if (!fs.existsSync(destParent)) {
		await makeDirAsync(destParent);
	}

	return internalCopyAsync(destStat, src, dest, opts);
}
