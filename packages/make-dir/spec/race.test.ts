import emptyDir from '@hexatool/fs-empty-dir';
import remove from '@hexatool/fs-remove';
import fs from 'graceful-fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import makeDirAsync from '../src/async';

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

	let TEST_DIR: string;
	let file: string;

	beforeEach(() => {
		TEST_DIR = path.join(os.tmpdir(), 'hexatool', 'make-dir', 'race');
		emptyDir(TEST_DIR);
		const ps = [TEST_DIR]

		for (let i = 0; i < 15; i++) {
			const dir = Math.floor(Math.random() * Math.pow(16, 4)).toString(16)
			ps.push(dir)
		}

		file = path.join(...ps)
	});

	afterEach(() => remove(TEST_DIR));

	describe('async', () => {
		it('should make the directory', async () => {
			await Promise.all([
				makeDirAsync(file, 0o755),
				makeDirAsync(file, 0o755),
				makeDirAsync(file, 0o755),
			])
			await assert(file)
		});
	});
});
