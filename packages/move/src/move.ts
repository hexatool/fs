import * as path from 'node:path';

import makeDirSync from '@hexatool/fs-make-dir';
import makeDirAsync from '@hexatool/fs-make-dir/async';
import {
	checkParentPaths as checkParentPathsSync,
	checkPaths as checkPathsSync,
} from '@hexatool/fs-stat-util';
import {
	checkParentPaths as checkParentPathsAsync,
	checkPaths as checkPathsAsync,
} from '@hexatool/fs-stat-util/async';

import { doRenameAsync, doRenameSync } from './do-rename';
import { isParentRoot } from './is-parent-root';
import type { MoveOptions } from './types';

export async function moveAsync(src: string, dest: string, opts?: MoveOptions): Promise<void> {
	const { srcStat, isChangingCase = false } = await checkPathsAsync(src, dest, 'move');
	await checkParentPathsAsync(src, srcStat, dest, 'move');
	if (!isParentRoot(dest)) {
		await makeDirAsync(path.dirname(dest));
	}
	await doRenameAsync(src, dest, opts?.overwrite, isChangingCase);
}

export function moveSync(src: string, dest: string, opts?: MoveOptions): void {
	const { srcStat, isChangingCase = false } = checkPathsSync(src, dest, 'move');
	checkParentPathsSync(src, srcStat, dest, 'move');
	if (!isParentRoot(dest)) {
		makeDirSync(path.dirname(dest));
	}
	doRenameSync(src, dest, opts?.overwrite, isChangingCase);
}
