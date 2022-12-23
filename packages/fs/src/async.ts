import { existsSync as exists } from 'node:fs';
import {
	readdir as readDir,
	readFile,
	realpath as realPath,
	stat,
	writeFile,
} from 'node:fs/promises';

import createFile from '@hexatool/fs-create-file/async';
import emptyDir from '@hexatool/fs-empty-dir/async';
import makeDir from '@hexatool/fs-make-dir/async';
import pathExistsAsync from '@hexatool/fs-path-exists/async';
import remove from '@hexatool/fs-remove/async';
import { areIdentical, checkPaths, getStats } from '@hexatool/fs-stat/async';

export {
	areIdentical,
	checkPaths,
	createFile,
	emptyDir,
	exists,
	getStats,
	makeDir,
	pathExistsAsync,
	readDir,
	readFile,
	realPath,
	remove,
	stat,
	writeFile,
};
