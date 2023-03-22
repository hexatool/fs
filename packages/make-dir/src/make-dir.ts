import type { Mode } from 'node:fs';

import checkPath from './check-path';
import type { MakeDirSettingsOrOptions } from './settings';
import { MakeDirSettings } from './settings';

export async function makeDirAsync(
	path: string,
	settingsOrOptions: MakeDirSettingsOrOptions | Mode = 0o777
): Promise<void> {
	checkPath(path);
	const { fs, mode } = MakeDirSettings.getSettings(settingsOrOptions);

	await fs.mkdir(path, {
		mode,
		recursive: true,
	});
}

export function makeDirSync(
	path: string,
	settingsOrOptions: MakeDirSettingsOrOptions | Mode = 0o777
): void {
	checkPath(path);
	const { fs, mode } = MakeDirSettings.getSettings(settingsOrOptions);

	fs.mkdirSync(path, {
		mode,
		recursive: true,
	});
}
