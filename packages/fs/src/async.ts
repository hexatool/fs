import { existsSync as exists } from 'node:fs';
import { readdir as readDir, stat, writeFile } from 'node:fs/promises';

import emptyDir from '@hexatool/fs-empty-dir/async';
import makeDir from '@hexatool/fs-make-dir/async';
import pathExists from '@hexatool/fs-path-exists/async';
import remove from '@hexatool/fs-remove/async';

export { emptyDir, exists, makeDir, pathExists, readDir, remove, stat, writeFile };
