import copySync from '@hexatool/fs-copy';
import copyAsync from '@hexatool/fs-copy/async';
import removeSync from '@hexatool/fs-remove';
import removeAsync from '@hexatool/fs-remove/async';

export function moveAcrossDeviceSync(src: string, dest: string, overwrite?: boolean): void {
	const opts = {
		overwrite: overwrite ?? false,
		errorOnExist: true,
		preserveTimestamps: true,
	};
	copySync(src, dest, opts);

	removeSync(src);
}

export async function moveAcrossDeviceAsync(
	src: string,
	dest: string,
	overwrite?: boolean
): Promise<void> {
	const opts = {
		overwrite: overwrite ?? false,
		errorOnExist: true,
		preserveTimestamps: true,
	};
	await copyAsync(src, dest, opts);

	await removeAsync(src);
}
