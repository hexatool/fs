import { fs } from '@hexatool/fs-file-system';

export function copyLinkSync(resolvedSrc: string, dest: string): void {
	fs.unlinkSync(dest);
	fs.symlinkSync(resolvedSrc, dest);
}

export async function copyLinkAsync(resolvedSrc: string, dest: string): Promise<void> {
	await fs.promises.unlink(dest);
	await fs.promises.symlink(resolvedSrc, dest);
}
