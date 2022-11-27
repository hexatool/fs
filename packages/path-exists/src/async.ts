import { fs } from '@hexatool/fs-file-system';

import type { PathLike } from 'fs';

const pathExistsAsync = (path: PathLike): Promise<boolean> => {
	return fs.promises.access(path)
		.then(() => true)
		.catch(() => false);
};

export default pathExistsAsync;
