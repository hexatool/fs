import { describe, it, expect } from 'vitest';
import makeDirAsync from '../src/async';
import { makeDirSync } from '../src/make-dir';

const isWindows = process.platform === 'win32';

describe.runIf(isWindows)('@hexatool/fs-make-dir', () => {
	describe('sync', () => {
		it.runIf(isWindows)('should throw an error if incorrect file', () => {
			const file = './bad?dir'
			const fn = () => makeDirSync(file);
			expect(fn).rejects.toThrow();
			try {
				fn();
			} catch (e: any) {
				expect(e.code.includes(e.code)).toBeTruthy();
			}
		});
	});
	describe('async', () => {
		it.runIf(isWindows)('should throw an error if incorrect file', async () => {
			const file = 'c:\\tmp\foo:moo'
			const fn = () => makeDirAsync(file);
			expect(fn).rejects.toThrow();
			try {
				await fn();
			} catch (e: any) {
				expect(e.code.includes(e.code)).toBeTruthy();
			}
		});
	});
});
