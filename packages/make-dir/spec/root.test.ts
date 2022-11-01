import * as fs from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';
import makeDirAsync from '../src/async';
import makeDirSync from '../src/sync';

const isWindows = process.platform === 'win32';

describe('@hexatool/fs-make-dir', () => {

	// '/' on unix
	const dir = path.normalize(path.resolve(path.sep)).toLowerCase();

	describe('sync', () => {
		test.skipIf(isWindows)('should make the directory with root path', () => {
			makeDirSync(dir, 0o755);
			const stat = fs.statSync(dir);
			expect(stat.isDirectory()).toBeTruthy();
		});
	});
	describe('async', () => {
		test.skipIf(isWindows)('should make the directory with root path', async () => {
			await makeDirAsync(dir, 0o755);
			const stat = fs.statSync(dir);
			expect(stat.isDirectory()).toBeTruthy();
		});
	});
});
