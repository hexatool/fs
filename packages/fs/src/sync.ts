import {
	existsSync as exists,
	readdirSync as readDir,
	statSync as stat,
	writeFileSync as writeFile,
} from 'node:fs';

import emptyDir from '@hexatool/fs-empty-dir';
import makeDir from '@hexatool/fs-make-dir';
import remove from '@hexatool/fs-remove';

export { emptyDir, exists, makeDir, readDir, remove, stat, writeFile };
