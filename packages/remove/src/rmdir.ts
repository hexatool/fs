import fs from 'graceful-fs';
import { rmkidsSync, rmkids } from './rmkids';

export function rmdirSync(path: string, originalEr: any) {
	try {
		fs.rmdirSync(path);
	} catch (err: any) {
		if (err.code === 'ENOTDIR') {
			throw originalEr;
		} else if (err.code === 'ENOTEMPTY' || err.code === 'EEXIST' || err.code === 'EPERM') {
			rmkidsSync(path);
		} else if (err.code !== 'ENOENT') {
			throw err;
		}
	}
}

export async function rmdir(path: string, originalEr: any) {
	try {
		await fs.promises.rmdir(path);
	} catch (err: any) {
		if (err.code === 'ENOTDIR') {
			throw originalEr;
		} else if (err.code === 'ENOTEMPTY' || err.code === 'EEXIST' || err.code === 'EPERM') {
			await rmkids(path);
		} else if (err.code !== 'ENOENT') {
			throw err;
		}
	}
}
