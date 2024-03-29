import os from 'node:os';
import path from 'node:path';

import { emptyDir, exists, remove, stat as fsStat, writeFile } from '@hexatool/fs';
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';

import makeDirAsync from '../src/async';
import makeDirSync from '../src/sync';

const isWindows = process.platform === 'win32';

function existsDir(path: string) {
	expect(exists(path)).toBeTruthy();
	const stat = fsStat(path);
	expect(stat.isDirectory()).toBeTruthy();
}

function notExistsDir(path: string) {
	expect(exists(path)).toBeFalsy();
}

function assert(file: string, uMode = 0o755, wMode = 0o666) {
	existsDir(file);
	const stat = fsStat(file);
	if (os.platform().indexOf('win') === 0) {
		expect(stat.mode & 0o777).toBe(wMode);
	} else {
		expect(stat.mode & 0o777).toBe(uMode);
	}
	expect(stat.isDirectory()).toBeTruthy();
}

describe('@hexatool/fs-make-dir', () => {
	describe('should create a directory', () => {
		let TEST_DIR: string;

		beforeEach(() => {
			TEST_DIR = path.join(os.tmpdir(), ...'@hexatool/fs-make-dir'.split('/'));
			emptyDir(TEST_DIR);
		});

		afterEach(() => remove(TEST_DIR));

		it(`sync`, () => {
			const dir = path.join(TEST_DIR, `tmp-${Date.now()}${Math.random()}`);
			notExistsDir(dir);
			makeDirSync(dir);
			existsDir(dir);
		});
		it(`async`, async () => {
			const dir = path.join(TEST_DIR, `tmp-${Date.now()}${Math.random()}`);
			notExistsDir(dir);
			await makeDirAsync(dir);
			existsDir(dir);
		});
	});
	describe('should create a directory recursively', () => {
		let TEST_DIR: string;

		beforeEach(() => {
			TEST_DIR = path.join(os.tmpdir(), ...'@hexatool/fs-make-dir'.split('/'), 'mkdir2');
			emptyDir(TEST_DIR);
		});

		afterEach(() => remove(TEST_DIR));

		it(`sync`, () => {
			const dir = path.join(TEST_DIR, `tmp-${Date.now()}${Math.random()}`);
			const newDir = path.join(TEST_DIR, 'dfdf', 'ffff', 'aaa');
			notExistsDir(dir);
			makeDirSync(newDir);
			existsDir(newDir);
		});
		it(`async`, async () => {
			const dir = path.join(TEST_DIR, `tmp-${Date.now()}${Math.random()}`);
			const newDir = path.join(TEST_DIR, 'dfdf', 'ffff', 'aaa');
			notExistsDir(dir);
			await makeDirAsync(newDir);
			existsDir(newDir);
		});
	});
	describe.skipIf(isWindows)('should create a root directory', () => {
		// '/' on unix
		const dir = path.normalize(path.resolve(path.sep)).toLowerCase();

		it(`sync`, () => {
			makeDirSync(dir);
			existsDir(dir);
		});
		it(`async`, async () => {
			await makeDirAsync(dir);
			existsDir(dir);
		});
	});
	describe('should create a directory with dots in name', () => {
		let TEST_DIR: string;

		beforeEach(() => {
			TEST_DIR = path.join(os.tmpdir(), ...'@hexatool/fs-make-dir'.split('/'), 'dots');
			emptyDir(TEST_DIR);
		});

		afterEach(() => remove(TEST_DIR));

		it(`sync`, () => {
			const dir = path.join(TEST_DIR, (Math.random() * (1 << 30)).toString(16));
			notExistsDir(dir);
			makeDirSync(dir, 0o755);
			assert(dir);
		});
		it(`async`, async () => {
			const file = path.join(TEST_DIR, `${(Math.random() * (1 << 30)).toString(16)}.json`);
			await makeDirAsync(file, 0o755);
			assert(file);
		});
	});
	describe('should create a directory with relative path', () => {
		const TEMP = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
		let dir: string;

		beforeEach(() => {
			const x = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
			const y = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
			const z = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);

			// relative path
			dir = path.join(TEMP, x, y, z);
		});

		afterAll(() => remove(TEMP));

		it(`sync`, () => {
			notExistsDir(dir);
			makeDirSync(dir, 0o755);
			assert(dir);
		});
		it(`async`, async () => {
			notExistsDir(dir);
			await makeDirAsync(dir, 0o755);
			assert(dir);
		});
	});
	describe('should create a directory with permissions', () => {
		let TEST_DIR: string;
		let TEST_SUB_DIR: string;

		beforeEach(() => {
			const ps = [];
			for (let i = 0; i < 15; i++) {
				const dir = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
				ps.push(dir);
			}

			TEST_SUB_DIR = ps.join(path.sep);

			TEST_DIR = path.join(os.tmpdir(), ...'@hexatool/fs-make-dir'.split('/'), 'chmod');
			TEST_SUB_DIR = path.join(TEST_DIR, TEST_SUB_DIR);

			emptyDir(TEST_DIR);
		});

		afterEach(() => remove(TEST_DIR));

		describe(`744`, () => {
			it(`sync`, () => {
				notExistsDir(TEST_SUB_DIR);
				makeDirSync(TEST_SUB_DIR, 0o744);
				assert(TEST_SUB_DIR, 0o744, 0o666);
			});
			it(`async`, async () => {
				notExistsDir(TEST_SUB_DIR);
				await makeDirAsync(TEST_SUB_DIR, 0o744);
				assert(TEST_SUB_DIR, 0o744, 0o666);
			});
		});

		describe(`755`, () => {
			it(`sync`, () => {
				notExistsDir(TEST_SUB_DIR);
				makeDirSync(TEST_SUB_DIR, 0o755);
				assert(TEST_SUB_DIR, 0o755, 0o666);
			});
			it(`async`, async () => {
				notExistsDir(TEST_SUB_DIR);
				await makeDirAsync(TEST_SUB_DIR, 0o755);
				assert(TEST_SUB_DIR, 0o755, 0o666);
			});
		});
	});
	describe('should create a directory simultaneously', () => {
		let TEST_DIR: string;
		let file: string;

		beforeEach(() => {
			TEST_DIR = path.join(os.tmpdir(), ...'@hexatool/fs-make-dir'.split('/'), 'race');
			emptyDir(TEST_DIR);
			const ps = [TEST_DIR];

			for (let i = 0; i < 15; i++) {
				const dir = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
				ps.push(dir);
			}

			file = path.join(...ps);
		});

		afterEach(() => remove(TEST_DIR));

		it('should works', async () => {
			await Promise.all([
				makeDirAsync(file, 0o755),
				makeDirAsync(file, 0o755),
				makeDirAsync(file, 0o755),
			]);
			assert(file);
		});
	});
	describe('should throw an exception if there is a file in the way', () => {
		let TEST_DIR: string;
		let file: string;

		beforeEach(() => {
			TEST_DIR = path.join(os.tmpdir(), 'hexatool', 'make-dir', 'clobber');

			emptyDir(TEST_DIR);

			const ps = [TEST_DIR];

			for (let i = 0; i < 15; i++) {
				const dir = Math.floor(Math.random() * Math.pow(16, 4)).toString(16);
				ps.push(dir);
			}

			file = ps.join(path.sep);

			// a file in the way
			const itw = ps.slice(0, 2).join(path.sep);

			writeFile(itw, 'I AM IN THE WAY, THE TRUTH, AND THE LIGHT.');

			const stat = fsStat(itw);
			expect(stat).toBeDefined();
			expect(stat.isFile()).toBeTruthy();
		});

		it('sync', () => {
			const mode = 0o755;
			const fn = () => makeDirSync(file, mode);
			expect(fn).toThrow();
			try {
				fn();
			} catch (e: any) {
				expect(e.code).toBe('ENOTDIR');
			}
		});

		it('async', async () => {
			const mode = 0o755;
			const fn = () => makeDirAsync(file, mode);
			await expect(fn).rejects.toThrow();
			try {
				await fn();
			} catch (e: any) {
				expect(e.code).toBe('ENOTDIR');
			}
		});
	});
	describe.runIf(isWindows)('should throw an exception if the drive does not exists', () => {
		const invalidDrivePath = 'W:\\Some\\Random\\Folder';

		it('sync', () => {
			const fn = () => makeDirSync(invalidDrivePath);
			expect(fn).toThrow();
			try {
				fn();
			} catch (e: any) {
				expect(['EPERM', 'ENOENT'].includes(e.code as string)).toBeTruthy();
			}
		});

		it('async', async () => {
			const fn = () => makeDirAsync(invalidDrivePath);
			await expect(fn).rejects.toThrow();
			try {
				await fn();
			} catch (e: any) {
				expect(['EPERM', 'ENOENT'].includes(e.code as string)).toBeTruthy();
			}
		});
	});
	describe.runIf(isWindows)('should throw an exception if the path is invalid', () => {
		it('sync', () => {
			const file = './bad?dir';
			const fn = () => makeDirSync(file);
			expect(fn).toThrow();
			try {
				fn();
			} catch (e: any) {
				expect(e.code).toBe('EINVAL');
			}
		});

		it('async', async () => {
			const file = 'c:\\tmp\foo:moo';
			const fn = () => makeDirAsync(file);
			await expect(fn).rejects.toThrow();
			try {
				await fn();
			} catch (e: any) {
				expect(e.code).toBe('EINVAL');
			}
		});
	});
});
