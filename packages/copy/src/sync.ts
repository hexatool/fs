import path from 'node:path';

import { fs } from '@hexatool/fs-file-system';
import makeDirSync from '@hexatool/fs-make-dir';
import {
	checkParentPaths as checkParentPathsSync,
	checkPaths as checkPathsSync,
} from '@hexatool/fs-stat';

import DEFAULT_OPTIONS from './default';
import { internalCopySync } from './internal-copy';
import type { CopyOptions } from './types';

export default function copy(src: string, dest: string, opts: CopyOptions = DEFAULT_OPTIONS): void {
	// Warn about using preserveTimestamps on 32-bit node
	if (opts.preserveTimestamps && process.arch === 'ia32') {
		process.emitWarning(
			'Using the preserveTimestamps option in 32-bit node is not recommended;\n\n' +
				'\tsee https://github.com/jprichardson/node-fs-extra/issues/269',
			'Warning',
			'hexatool-WARN0002'
		);
	}

	const { srcStat, destStat } = checkPathsSync(src, dest, 'copy', opts);
	checkParentPathsSync(src, srcStat, dest, 'copy');

	if (opts.filter && !opts.filter(src, dest)) {
		return;
	}
	const destParent = path.dirname(dest);
	if (!fs.existsSync(destParent)) {
		makeDirSync(destParent);
	}
	internalCopySync(destStat, src, dest, opts);
}
