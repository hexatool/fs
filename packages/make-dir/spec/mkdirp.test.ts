import emptyDir from '@hexatool/fs-empty-dir';
import remove from '@hexatool/fs-remove';
import fs from 'graceful-fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import makeDirSync from '../src/sync';
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
		TEST_DIR = path.join(os.tmpdir(), 'hexatool', 'make-dir', 'mkdirp');

		const x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
		const y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
		const z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

		file = path.join(TEST_DIR, x, y, z);

		emptyDir(TEST_DIR);
	});

	afterEach(() => remove(TEST_DIR));

	describe('sync', () => {
		it('should make the directory', async () => {
			makeDirSync(file, 0o755);
			await assert(file);
		});
	});

	describe('async', () => {
		it('should make the directory', async () => {
			await makeDirAsync(file, 0o755);
			await assert(file);
		});
	});
});
