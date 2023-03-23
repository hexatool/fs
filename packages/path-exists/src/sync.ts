import type { PathLike } from 'fs';

import { PathExistsOptionsOrSettings, PathExistsSettings } from './settings';

const pathExists = (path: PathLike, optionsOrSettings?: PathExistsOptionsOrSettings): boolean => {
	const { fs } = PathExistsSettings.getSettings(optionsOrSettings);

	return fs.pathExistsSync(path);
};

export * from './adapters';
export * from './settings';

export default pathExists;
