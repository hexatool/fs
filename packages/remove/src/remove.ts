import type { RemoveSettingsOrOptions } from './settings';
import { RemoveSettings } from './settings';

export async function removeAsync(
	path: string,
	settingsOrOptions?: RemoveSettingsOrOptions
): Promise<void> {
	const { fs, recursive, force } = RemoveSettings.getSettings(settingsOrOptions);
	await fs.rm(path, { recursive, force });
}

export function removeSync(path: string, settingsOrOptions?: RemoveSettingsOrOptions): void {
	const { fs, recursive, force } = RemoveSettings.getSettings(settingsOrOptions);
	fs.rmSync(path, { recursive, force });
}
