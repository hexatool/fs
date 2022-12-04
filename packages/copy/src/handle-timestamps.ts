import { fileIsNotWritable } from './file-is-not-writable';
import { makeFileWritableAsync, makeFileWritableSync } from './make-file-writable';
import { setDestTimestampsAsync, setDestTimestampsSync } from './set-dest-timestamps';

export function handleTimestampsSync(srcMode: bigint | number, src: string, dest: string): void {
	// Make sure the file is writable before setting the timestamp
	// otherwise open fails with EPERM when invoked with 'r+'
	// (through utimes call)
	if (fileIsNotWritable(srcMode)) {
		makeFileWritableSync(dest, srcMode);
	}
	setDestTimestampsSync(src, dest);
}

export async function handleTimestampsAsync(
	srcMode: bigint | number,
	src: string,
	dest: string
): Promise<void> {
	// Make sure the file is writable before setting the timestamp
	// otherwise open fails with EPERM when invoked with 'r+'
	// (through utimes call)
	if (fileIsNotWritable(srcMode)) {
		await makeFileWritableAsync(dest, srcMode);
	}
	await setDestTimestampsAsync(src, dest);
}
