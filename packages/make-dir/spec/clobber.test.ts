import emptyDir from '@hexatool/fs-empty-dir';
import fs from 'graceful-fs';
import os from 'node:os';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import makeDirAsync from '../src/async';
import makeDirSync from '../src/sync';

describe('@hexatool/fs-make-dir', () => {

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

		fs.writeFileSync(itw, 'I AM IN THE WAY, THE TRUTH, AND THE LIGHT.');

		const stat = fs.statSync(itw);
		expect(stat).toBeDefined();
		expect(stat.isFile()).toBeTruthy();
	});

	describe('sync', () => {
		it('clobber', () => {
			const mode = 0o755;
			const fn = () => makeDirSync(file, mode);
			expect(fn).toThrow();
			try {
				fn()
			} catch (e: any) {
				expect(e.code).toBe('ENOTDIR')
			}
		});
	});

	describe('async', () => {
		it('clobber', async () => {
			const mode = 0o755;
			const fn = () => makeDirAsync(file, mode);
			expect(fn).rejects.toThrow();
			try {
				await fn()
			} catch (e: any) {
				expect(e.code).toBe('ENOTDIR')
			}
		});
	});
});
