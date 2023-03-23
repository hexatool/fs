import type { RemoveOptionsOrSettings } from './settings';
import { RemoveSettings } from './settings';

export async function removeAsync(
	path: string,
	settingsOrOptions?: RemoveOptionsOrSettings
): Promise<void> {
	const { fs, recursive, force } = RemoveSettings.getSettings(settingsOrOptions);
	await fs.rm(path, { recursive, force });
}

export function removeSync(path: string, settingsOrOptions?: RemoveOptionsOrSettings): void {
	const { fs, recursive, force } = RemoveSettings.getSettings(settingsOrOptions);
	fs.rmSync(path, { recursive, force });
}
