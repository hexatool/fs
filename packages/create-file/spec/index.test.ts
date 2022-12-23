import os from 'node:os';
import path from 'node:path';

import { emptyDir, makeDir, pathExists, readFile, remove, writeFile } from '@hexatool/fs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import createFileAsync from '../src/async';
import createFileSync from '../src/sync';

describe('@hexatool/fs-create-file', () => {
	let TEST_DIR: string;

	beforeEach(() => {
		TEST_DIR = path.join(os.tmpdir(), ...'@hexatool/fs-create-file'.split('/'));
		emptyDir(TEST_DIR);
	});

	afterEach(() => remove(TEST_DIR));

	describe('should create the file', () => {
		describe('when the file and directory does not exist', () => {
			it('sync', () => {
				const file = path.join(TEST_DIR, `${Math.random()}t-ne`, `${Math.random()}.txt`);
				expect(pathExists(file)).toBeFalsy();
				createFileSync(file);
				expect(pathExists(file)).toBeTruthy();
			});
			it('async', async () => {
				const file = path.join(TEST_DIR, `${Math.random()}t-ne`, `${Math.random()}.txt`);
				expect(pathExists(file)).toBeFalsy();
				await createFileAsync(file);
				expect(pathExists(file)).toBeTruthy();
			});
		});
	});

	describe('should not modify the file', () => {
		describe('when the file does exist', () => {
			it('sync', () => {
				const file = path.join(TEST_DIR, `${Math.random()}t-e`, `${Math.random()}.txt`);
				makeDir(path.dirname(file));
				writeFile(file, 'hello world');
				expect(pathExists(file)).toBeTruthy();
				createFileSync(file);
				const content = readFile(file, 'utf8');
				expect(content).toBe('hello world');
			});
			it('async', async () => {
				const file = path.join(TEST_DIR, `${Math.random()}t-e`, `${Math.random()}.txt`);
				makeDir(path.dirname(file));
				writeFile(file, 'hello world');
				expect(pathExists(file)).toBeTruthy();
				await createFileAsync(file);
				const content = readFile(file, 'utf8');
				expect(content).toBe('hello world');
			});
		});
	});

	describe('should give clear error if node in directory tree is a file', () => {
		it('sync', () => {
			const existingFile = path.join(
				TEST_DIR,
				`${Math.random()}ts-e`,
				`${Math.random()}.txt`
			);
			makeDir(path.dirname(existingFile));
			writeFile(existingFile, 'hello world');
			const file = path.join(existingFile, `${Math.random()}.txt`);
			expect(() => createFileSync(file)).toThrow();
			try {
				createFileSync(file);
			} catch (e: any) {
				expect(e.code).toBe('ENOTDIR');
			}
		});
		it('async', async () => {
			const existingFile = path.join(
				TEST_DIR,
				`${Math.random()}ts-e`,
				`${Math.random()}.txt`
			);
			makeDir(path.dirname(existingFile));
			writeFile(existingFile, 'hello world');
			const file = path.join(existingFile, `${Math.random()}.txt`);
			await expect(() => createFileAsync(file)).rejects.toThrow();
			try {
				await createFileAsync(file);
			} catch (e: any) {
				expect(e.code).toBe('ENOTDIR');
			}
		});
	});
});
