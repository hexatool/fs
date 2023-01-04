import {
	existsSync as exists,
	readdirSync as readDir,
	readFileSync as readFile,
	realpathSync as realPath,
	statSync as stat,
	writeFileSync as writeFile,
} from 'node:fs';

import copy from '@hexatool/fs-copy';
import createFile from '@hexatool/fs-create-file';
import createLink from '@hexatool/fs-create-link';
import emptyDir from '@hexatool/fs-empty-dir';
import makeDir from '@hexatool/fs-make-dir';
import move from '@hexatool/fs-move';
import pathExists from '@hexatool/fs-path-exists';
import remove from '@hexatool/fs-remove';
import {
	areIdentical,
	checkParentPaths,
	checkPaths,
	getStats,
	isSrcSubdirectory,
	StatsResult,
} from '@hexatool/fs-stat';

export type { StatsResult };

const ensureFile = createFile;
const ensureDir = makeDir;
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
	pathExists,
	readDir,
	readFile,
	realPath,
	remove,
	stat,
	writeFile,
};
