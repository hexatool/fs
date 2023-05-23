import type { PathLike } from 'fs';

import type { PathExistsOptionsOrSettings } from './settings';
import { PathExistsSettings } from './settings';

const pathExists = (path: PathLike, optionsOrSettings?: PathExistsOptionsOrSettings): boolean => {
	const { fs } = PathExistsSettings.getSettings(optionsOrSettings);

	return fs.pathExistsSync(path);
};

export * from './adapters';
export * from './settings';

export default pathExists;
