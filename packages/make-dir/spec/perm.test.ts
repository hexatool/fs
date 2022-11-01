import emptyDir from '@hexatool/fs-empty-dir';
import remove from '@hexatool/fs-remove';
import fs from 'graceful-fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
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

	let TEST_DIR: string;

	beforeEach(() => {
		TEST_DIR = path.join(os.tmpdir(), 'hexatool', 'make-dir', 'perm');
		emptyDir(TEST_DIR);
	});

	afterEach(() => remove(TEST_DIR));

	describe('sync', () => {
		it('should make the directory', async () => {
			const file = path.join(TEST_DIR, (Math.random() * (1 << 30)).toString(16));
			makeDirSync(file, 0o755)
			await assert(file)
		});
	});

	describe('async', () => {
		it('should make the directory', async () => {
			const file = path.join(TEST_DIR, (Math.random() * (1 << 30)).toString(16) + '.json')
			await makeDirAsync(file, 0o755)
			await assert(file)
		});
	});
});
