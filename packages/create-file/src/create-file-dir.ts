import { statSync as stat } from 'node:fs';

export async function createFile(path: string): Promise<void> {}

export function createFileSync(path: string): void {
	let stats;
	try {
		stats = stat(path);
	} catch {}
	if (stats && stats.isFile()) {
		return;
	}

	return;
}
