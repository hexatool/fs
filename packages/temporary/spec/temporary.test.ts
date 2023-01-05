import path from 'node:path';

import { pathExists } from '@hexatool/fs';
import { describe, expect, it } from 'vitest';

import temporaryDirAsync, { makeTemporaryDir as makeTemporaryDirAsync } from '../src/async';
import temporaryDirSync, { makeTemporaryDir as makeTemporaryDirSync } from '../src/sync';

describe('@hexatool/fs-temporary', () => {
	it('should temporaryDir return an absolute path', () => {
		expect(path.isAbsolute(temporaryDirAsync)).toBeTruthy();
		expect(path.isAbsolute(temporaryDirSync)).toBeTruthy();
	});
	describe('should create a temporary directory', () => {
		it(`sync`, () => {
			const prefix = 'sync_';
			const createdDir = makeTemporaryDirSync();
			const createdWithPrefixDir = makeTemporaryDirSync(prefix);
			const baseCreatedWithPrefixDir = path.basename(createdWithPrefixDir);
			expect(createdDir.includes(temporaryDirSync)).toBeTruthy();
			expect(baseCreatedWithPrefixDir.startsWith(prefix)).toBeTruthy();
			expect(pathExists(createdDir)).toBeTruthy();
			expect(pathExists(createdWithPrefixDir)).toBeTruthy();
		});
		it(`async`, async () => {
			const prefix = 'async_';
			const createdDir = await makeTemporaryDirAsync();
			const createdWithPrefixDir = await makeTemporaryDirAsync(prefix);
			const baseCreatedWithPrefixDir = path.basename(createdWithPrefixDir);
			expect(createdDir.includes(temporaryDirAsync)).toBeTruthy();
			expect(baseCreatedWithPrefixDir.startsWith(prefix)).toBeTruthy();
			expect(pathExists(createdDir)).toBeTruthy();
			expect(pathExists(createdWithPrefixDir)).toBeTruthy();
		});
	});
});
