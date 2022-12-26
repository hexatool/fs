import {
	existsSync as exists,
	readdirSync as readDir,
	readFileSync as readFile,
	realpathSync as realPath,
	statSync as stat,
	writeFileSync as writeFile,
} from 'node:fs';

import createFile from '@hexatool/fs-create-file';
import emptyDir from '@hexatool/fs-empty-dir';
import makeDir from '@hexatool/fs-make-dir';
import pathExists from '@hexatool/fs-path-exists';
import remove from '@hexatool/fs-remove';
import { areIdentical, checkPaths, getStats } from '@hexatool/fs-stat';

const ensureFile = createFile;
const ensureDir = makeDir;

export {
	areIdentical,
	checkPaths,
	createFile,
	emptyDir,
	ensureDir,
	ensureFile,
	exists,
	getStats,
	makeDir,
	pathExists,
	readDir,
	readFile,
	realPath,
	remove,
	stat,
	writeFile,
};
