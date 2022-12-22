import os from 'node:os';
import path from 'node:path';

import { createFile, exists, makeDir, readDir, remove } from '@hexatool/fs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import emptyDirAsync from '../src/async';
import emptyDirSync from '../src/sync';

describe('@hexatool/fs-empty-dir', root => {
	let TEST_DIR: string;

	beforeEach(() => {
		TEST_DIR = path.join(os.tmpdir(), ...root.name.split('/'), 'mkdir');
		if (exists(TEST_DIR)) {
			remove(TEST_DIR);
		}
		makeDir(TEST_DIR);
	});

	afterEach(() => remove(TEST_DIR));

	describe('should empty a directory', () => {
		describe('when directory exists and contains items', () => {
			beforeEach(() => {
				createFile(path.join(TEST_DIR, 'foo.bar'));
			});
			it('sync', () => {
				expect(readDir(TEST_DIR)).lengthOf(1);
				emptyDirSync(TEST_DIR);
				expect(readDir(TEST_DIR)).lengthOf(0);
			});
			it('async', async () => {
				expect(readDir(TEST_DIR)).lengthOf(1);
				await emptyDirAsync(TEST_DIR);
				expect(readDir(TEST_DIR)).lengthOf(0);
			});
		});

		describe('when directory exists and contains no items', () => {
			it('sync', () => {
				expect(readDir(TEST_DIR)).lengthOf(0);
				emptyDirSync(TEST_DIR);
				expect(readDir(TEST_DIR)).lengthOf(0);
			});
			it('async', async () => {
				expect(readDir(TEST_DIR)).lengthOf(0);
				await emptyDirAsync(TEST_DIR);
				expect(readDir(TEST_DIR)).lengthOf(0);
			});
		});

		describe('when directory does not exist', () => {
			it('async', () => {
				remove(TEST_DIR);
				expect(exists(TEST_DIR)).toBeFalsy();
				emptyDirSync(TEST_DIR);
				expect(readDir(TEST_DIR)).lengthOf(0);
			});
			it('sync', async () => {
				remove(TEST_DIR);
				expect(exists(TEST_DIR)).toBeFalsy();
				await emptyDirAsync(TEST_DIR);
				expect(readDir(TEST_DIR)).lengthOf(0);
			});
		});
	});
});
