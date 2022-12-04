import { setDestModeAsync, setDestModeSync } from './set-dest-mode';

export function makeFileWritableSync(dest: string, srcMode: bigint | number): void {
	setDestModeSync(dest, (srcMode as number) | 0o200);
}

export async function makeFileWritableAsync(dest: string, srcMode: bigint | number): Promise<void> {
	await setDestModeAsync(dest, (srcMode as number) | 0o200);
}
