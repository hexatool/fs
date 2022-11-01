import { describe, it,  } from 'vitest';
import { expect } from 'vitest';
import makeDirAsync from '../src/async';
import { makeDirSync } from '../src/make-dir';

const notWindows = process.platform !== 'win32';
const file = 'R:\\afasd\\afaff\\fdfd' // hopefully drive 'r' does not exist on appveyor

describe('@hexatool/fs-make-dir', () => {
	describe('sync', () => {
		it.skipIf(notWindows)('should throw an error if drive does not exists', () => {
			const fn = () => makeDirSync(file);
			expect(fn).rejects.toThrow();
			try {
				fn()
			} catch (e: any) {
				expect(e.code).toBe('ENOTDIR')
			}
		});
	});
	describe('async', () => {
		it.skipIf(notWindows)('should throw an error if drive does not exists', async () => {
			const fn = () => makeDirAsync(file);
			expect(fn).rejects.toThrow();
			try {
				await fn()
			} catch (e: any) {
				expect(e.code.includes(e.code))
			}
		});
	});
});
