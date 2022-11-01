import emptyDir from '@hexatool/fs-empty-dir';
import remove from '@hexatool/fs-remove';
import fs from 'graceful-fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import makeDirAsync from '../src/async';
import makeDirSync from '../src/sync';

describe('@hexatool/fs-make-dir', () => {

	let TEST_DIR: string;
	let TEST_SUB_DIR: string;

	beforeEach(() => {
		const ps = [];
		for (let i = 0; i < 15; i++) {
			const dir = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
			ps.push(dir);
		}

		TEST_SUB_DIR = ps.join(path.sep);

		TEST_DIR = path.join(os.tmpdir(), 'hexatool', 'make-dir', 'chmod');
		TEST_SUB_DIR = path.join(TEST_DIR, TEST_SUB_DIR);

		emptyDir(TEST_DIR);
	});

	afterEach(() => remove(TEST_DIR));

	describe('sync', () => {
		it('chmod-pre', () => {
			const mode = 0o744;
			makeDirSync(TEST_SUB_DIR, mode);
			const stat = fs.statSync(TEST_SUB_DIR);
			expect(stat).toBeDefined();
			expect(stat.isDirectory()).toBeTruthy();
			if (os.platform().indexOf('win') === 0) {
				expect(stat && stat.mode & 0o777).toStrictEqual(0o666);
			} else {
				expect(stat && stat.mode & 0o777).toStrictEqual(mode);
			}
		});
		it('chmod', () => {
			const mode = 0o755;
			makeDirSync(TEST_SUB_DIR, mode);
			const stat = fs.statSync(TEST_SUB_DIR);
			expect(stat).toBeDefined();
			expect(stat.isDirectory()).toBeTruthy();
		});
	});

	describe('async', () => {
		it('chmod-pre', async () => {
			const mode = 0o744;
			await makeDirAsync(TEST_SUB_DIR, mode);
			const stat = await fs.promises.stat(TEST_SUB_DIR);
			expect(stat).toBeDefined();
			expect(stat.isDirectory()).toBeTruthy();
			if (os.platform().indexOf('win') === 0) {
				expect(stat && stat.mode & 0o777).toStrictEqual(0o666);
			} else {
				expect(stat && stat.mode & 0o777).toStrictEqual(mode);
			}
		});
		it('chmod', async () => {
			const mode = 0o755;
			await makeDirAsync(TEST_SUB_DIR, mode);
			const stat = await fs.promises.stat(TEST_SUB_DIR);
			expect(stat).toBeDefined();
			expect(stat.isDirectory()).toBeTruthy();
		});
	});
});
