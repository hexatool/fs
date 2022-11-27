import os from 'node:os';
import path from 'node:path';

import { emptyDir, remove } from '@hexatool/fs';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import pathExistsAsync from '../src/async';
import pathExistsSync from '../src/sync';

describe('@hexatool/fs-path-exists', root => {
	let TEST_DIR: string;

	beforeEach(() => {
		TEST_DIR = path.join(os.tmpdir(), ...root.name.split('/'), 'path-exists');
		emptyDir(TEST_DIR);
	});

	afterEach(() => remove(TEST_DIR));

	describe('should return false if file does not exist', () => {
		it(`sync`, () => {
			const dir = path.join(TEST_DIR, 'some-random');
			const exist = pathExistsSync(dir);
			expect(exist).toBeFalsy();
		});
		it(`async`, async () => {
			const dir = path.join(TEST_DIR, 'some-random');
			const exist = await pathExistsAsync(dir);
			expect(exist).toBeFalsy();
		});
	});
	describe('should return true if file does exist', () => {
		it(`sync`, () => {
			const dir = path.join(TEST_DIR, 'path-exists');
			const exist = pathExistsSync(dir);
			expect(exist).toBeFalsy();
		});
		it(`async`, async () => {
			const dir = path.join(TEST_DIR, 'path-exists');
			const exist = await pathExistsAsync(dir);
			expect(exist).toBeFalsy();
		});
	});
});
