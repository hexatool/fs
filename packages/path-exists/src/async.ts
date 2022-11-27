import { access } from 'node:fs/promises';

import type { PathLike } from 'fs';

const pathExists = (path: PathLike): Promise<boolean> => {
	return access(path)
		.then(() => true)
		.catch(() => false);
};

export default pathExists;
