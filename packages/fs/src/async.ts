import { existsSync as exists } from 'node:fs';
import {
	readdir as readDir,
	readFile,
	realpath as realPath,
	stat,
	writeFile,
} from 'node:fs/promises';

import copy from '@hexatool/fs-copy/async';
import createFile from '@hexatool/fs-create-file/async';
import createLink from '@hexatool/fs-create-link/async';
import emptyDir from '@hexatool/fs-empty-dir/async';
import makeDir from '@hexatool/fs-make-dir/async';
import move from '@hexatool/fs-move/async';
import pathExistsAsync from '@hexatool/fs-path-exists/async';
import remove from '@hexatool/fs-remove/async';
import type { StatsResult } from '@hexatool/fs-stat';
import {
	areIdentical,
	checkParentPaths,
	checkPaths,
	getStats,
	isSrcSubdirectory,
} from '@hexatool/fs-stat/async';

export type { StatsResult };

const ensureDir = makeDir;
const ensureFile = createFile;
const ensureLink = createLink;

export {
	areIdentical,
	checkParentPaths,
	checkPaths,
	copy,
	createFile,
	createLink,
	emptyDir,
	ensureDir,
	ensureFile,
	ensureLink,
	exists,
	getStats,
	isSrcSubdirectory,
	makeDir,
	move,
	pathExistsAsync,
	readDir,
	readFile,
	realPath,
	remove,
	stat,
	writeFile,
};
