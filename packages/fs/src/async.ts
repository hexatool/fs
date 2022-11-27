import { existsSync as exists } from 'node:fs';
import { readdir as readDir, realpath as realPath, stat, writeFile } from 'node:fs/promises';

import emptyDir from '@hexatool/fs-empty-dir/async';
import makeDir from '@hexatool/fs-make-dir/async';
import pathExistsAsync from '@hexatool/fs-path-exists/async';
import remove from '@hexatool/fs-remove/async';
import { areIdentical, checkPaths, getStats } from '@hexatool/fs-stat/async';

export {
	areIdentical,
	checkPaths,
	emptyDir,
	exists,
	getStats,
	makeDir,
	pathExistsAsync,
	readDir,
	realPath,
	remove,
	stat,
	writeFile,
};
