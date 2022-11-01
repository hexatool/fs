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

	beforeEach(() => {
		TEST_DIR = path.join(os.tmpdir(), 'hexatool', 'make-dir', 'mkdir');
		emptyDir(TEST_DIR);
	});

	afterEach(() => remove(TEST_DIR));

	describe('sync', () => {
		it('should make the directory', () => {
			const dir = path.join(TEST_DIR, 'tmp-' + Date.now() + Math.random())
			expect(fs.existsSync(dir)).toBeFalsy();
			makeDirSync(dir);
			expect(fs.existsSync(dir)).toBeTruthy();
		});
		it('should make the entire directory path', () => {
			const dir = path.join(TEST_DIR, 'tmp-' + Date.now() + Math.random())
			const newDir = path.join(TEST_DIR, 'dfdf', 'ffff', 'aaa')
			expect(fs.existsSync(dir)).toBeFalsy();
			makeDirSync(newDir);
			expect(fs.existsSync(newDir)).toBeTruthy();
		});
	});

	describe('async', () => {
		it('should make the directory', async () => {
			const dir = path.join(TEST_DIR, 'tmp-' + Date.now() + Math.random())
			expect(fs.existsSync(dir)).toBeFalsy();
			await makeDirAsync(dir);
			expect(fs.existsSync(dir)).toBeTruthy();
		});
		it('should make the entire directory path', async () => {
			const dir = path.join(TEST_DIR, 'tmp-' + Date.now() + Math.random())
			const newDir = path.join(TEST_DIR, 'dfdf', 'ffff', 'aaa')
			expect(fs.existsSync(dir)).toBeFalsy();
			await makeDirAsync(newDir);
			expect(fs.existsSync(newDir)).toBeTruthy();
		});
	});
});
