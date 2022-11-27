import { access } from 'node:fs/promises';

import type { PathLike } from 'fs';

const pathExistsAsync = (path: PathLike): Promise<boolean> => {
	return access(path)
		.then(() => true)
		.catch(() => false);
};

export default pathExistsAsync;
