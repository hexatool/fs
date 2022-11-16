import emptyDir from '@hexatool/fs-empty-dir';
import makeDir from '@hexatool/fs-make-dir';
import remove from '@hexatool/fs-remove';
import { existsSync as exists, statSync as stat, writeFileSync as writeFile, readdirSync as readDir } from 'node:fs';

export {
	emptyDir,
	exists,
	makeDir,
	readDir,
	remove,
	stat,
	writeFile,
};
