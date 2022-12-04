import { fs } from '@hexatool/fs-file-system';

export async function utimesMillisAsync(path: string, atime: Date, mtime: Date): Promise<void> {
	const fd = await fs.promises.open(path, 'r+');
	fs.futimesSync(fd.fd, atime, mtime);
	fs.close(fd.fd);
}

export function utimesMillisSync(path: string, atime: Date, mtime: Date): void {
	const fd = fs.openSync(path, 'r+');
	fs.futimesSync(fd, atime, mtime);
	fs.closeSync(fd);
}
