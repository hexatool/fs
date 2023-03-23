import * as fs from 'node:fs';

export function setDestModeSync(dest: string, srcMode: bigint | number): void {
	fs.chmodSync(dest, srcMode as number);
}

export async function setDestModeAsync(dest: string, srcMode: bigint | number): Promise<void> {
	await fs.promises.chmod(dest, srcMode as number);
}
