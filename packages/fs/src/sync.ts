import {
	existsSync as exists,
	readdirSync as readDir,
	readFileSync as readFile,
	realpathSync as realPath,
	statSync as stat,
	writeFileSync as writeFile,
} from 'node:fs';

import copy from '@hexatool/fs-copy';
import crawl, { type CrawlerOptions } from '@hexatool/fs-crawl';
import createFile from '@hexatool/fs-create-file';
import createLink from '@hexatool/fs-create-link';
import emptyDir from '@hexatool/fs-empty-dir';
import makeDir from '@hexatool/fs-make-dir';
import move from '@hexatool/fs-move';
import pathExists from '@hexatool/fs-path-exists';
import remove from '@hexatool/fs-remove';
import type { StatsResult } from '@hexatool/fs-stat-util';
import {
	areIdentical,
	checkParentPaths,
	checkPaths,
	getStats,
	isSrcSubdirectory,
} from '@hexatool/fs-stat-util';
import temporaryDir, { makeTemporaryDir } from '@hexatool/fs-temporary';

export type { CrawlerOptions, StatsResult };

const ensureFile = createFile;
const ensureDir = makeDir;
const ensureLink = createLink;

export {
	areIdentical,
	checkParentPaths,
	checkPaths,
	copy,
	crawl,
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
	makeTemporaryDir,
	move,
	pathExists,
	readDir,
	readFile,
	realPath,
	remove,
	stat,
	temporaryDir,
	writeFile,
};
