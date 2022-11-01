import remove from '@hexatool/fs-remove';
import fs from 'graceful-fs';
import os from 'node:os';
import path from 'node:path';
import { beforeEach, describe, expect, it, afterAll } from 'vitest';
import makeDirAsync from '../src/async';
import makeDirSync from '../src/sync';

async function pathExists(path: string) {
	return fs.promises.access(path).then(() => true).catch(() => false);
}

async function assert(file: string) {
	const exists = await pathExists(file);
	expect(exists).toBeTruthy();
	const stat = fs.statSync(file);
	if (os.platform().indexOf('win') === 0) {
		expect(stat.mode & 0o777).toBe(0o666);
	} else {
		expect(stat.mode & 0o777).toBe(0o755);
	}
	expect(stat.isDirectory()).toBeTruthy();
}

describe('@hexatool/fs-make-dir', () => {

	const TEMP = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);;
	let file: string;

	beforeEach(() => {
		const x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
		const y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
		const z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

		// relative path
		file = path.join(TEMP, x, y, z);
	});

	afterAll(() => remove(TEMP));

	describe('sync', () => {
		it('should make the directory with relative path', async () => {
			makeDirSync(file, 0o755);
			await assert(file);
		});
	});
	describe('async', () => {
		it('should make the directory with relative path', async () => {
			await makeDirAsync(file, 0o755);
			await assert(file);
		});
	});
});
