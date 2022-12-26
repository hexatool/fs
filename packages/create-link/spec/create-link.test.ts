import os from 'node:os';
import path from 'node:path';

import { emptyDir, makeDir, remove, writeFile } from '@hexatool/fs';
import { fs } from '@hexatool/fs-file-system';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createLinkAsync, createLinkSync } from '../src/create-link';

describe('@hexatool/fs-create-link', () => {
	const TEST_DIR = path.join(os.tmpdir(), ...'@hexatool/fs-create-link'.split('/'));

	const tests: [string, string, string][] = [
		['./foo.txt', './link.txt', 'file-success'],
		['./foo.txt', './dir-foo/link.txt', 'file-success'],
		['./foo.txt', './empty-dir/link.txt', 'file-success'],
		['./foo.txt', './real-alpha/link.txt', 'file-success'],
		['./foo.txt', './real-alpha/real-beta/link.txt', 'file-success'],
		['./foo.txt', './real-alpha/real-beta/real-gamma/link.txt', 'file-success'],
		['./foo.txt', './alpha/link.txt', 'file-success'],
		['./foo.txt', './alpha/beta/link.txt', 'file-success'],
		['./foo.txt', './alpha/beta/gamma/link.txt', 'file-success'],
		['./foo.txt', './link-foo.txt', 'file-success'],
		['./dir-foo/foo.txt', './link-foo.txt', 'file-error'],
		['./missing.txt', './link.txt', 'file-error'],
		['./missing.txt', './missing-dir/link.txt', 'file-error'],
		['./foo.txt', './link.txt', 'file-success'],
		['./dir-foo/foo.txt', './link.txt', 'file-success'],
		['./missing.txt', './link.txt', 'file-error'],
		['../foo.txt', './link.txt', 'file-error'],
		['../dir-foo/foo.txt', './link.txt', 'file-error'],
		['./foo.txt', './dir-foo/foo.txt', 'file-error'],
		['./foo.txt', './link.txt', 'file-success'],
		['./dir-foo/foo.txt', './link.txt', 'file-success'],
		['./missing.txt', './link.txt', 'file-error'],
		['../foo.txt', './link.txt', 'file-error'],
		['../dir-foo/foo.txt', './link.txt', 'file-error'],
	];

	beforeAll(() => emptyDir(TEST_DIR));

	beforeEach(() => {
		writeFile(path.join(TEST_DIR, './foo.txt'), 'foo\n');
		makeDir(path.join(TEST_DIR, 'empty-dir'));
		makeDir(path.join(TEST_DIR, 'dir-foo'));
		writeFile(path.join(TEST_DIR, 'dir-foo/foo.txt'), 'dir-foo\n');
		makeDir(path.join(TEST_DIR, 'dir-bar'));
		writeFile(path.join(TEST_DIR, 'dir-bar/bar.txt'), 'dir-bar\n');
		makeDir(path.join(TEST_DIR, 'real-alpha/real-beta/real-gamma'));
		fs.linkSync(path.join(TEST_DIR, 'foo.txt'), path.join(TEST_DIR, 'link-foo.txt'));
	});

	afterEach(() => emptyDir(TEST_DIR));

	afterAll(() => remove(TEST_DIR));

	describe.each(tests.filter(v => v[2] === 'file-success'))(
		`should create link file using src %s and dest %s`,
		(src, dest) => {
			it('sync', () => {
				const srcPath = path.resolve(path.join(TEST_DIR, src));
				const dstPath = path.resolve(path.join(TEST_DIR, dest));
				createLinkSync(srcPath, dstPath);
				const srcContent = fs.readFileSync(srcPath, 'utf8');
				const dstDir = path.dirname(dstPath);
				const dstBasename = path.basename(dstPath);
				const isSymlink = fs.lstatSync(dstPath).isFile();
				const dstContent = fs.readFileSync(dstPath, 'utf8');
				const dstDirContents = fs.readdirSync(dstDir);
				expect(isSymlink).toBeTruthy();
				expect(srcContent).toBe(dstContent);
				expect(dstDirContents.indexOf(dstBasename)).toBeGreaterThanOrEqual(0);
			});
			it('async', async () => {
				const srcPath = path.resolve(path.join(TEST_DIR, src));
				const dstPath = path.resolve(path.join(TEST_DIR, dest));
				await createLinkAsync(srcPath, dstPath);
				const srcContent = fs.readFileSync(srcPath, 'utf8');
				const dstDir = path.dirname(dstPath);
				const dstBasename = path.basename(dstPath);
				const isSymlink = fs.lstatSync(dstPath).isFile();
				const dstContent = fs.readFileSync(dstPath, 'utf8');
				const dstDirContents = fs.readdirSync(dstDir);
				expect(isSymlink).toBeTruthy();
				expect(srcContent).toBe(dstContent);
				expect(dstDirContents.indexOf(dstBasename)).toBeGreaterThanOrEqual(0);
			});
		}
	);

	describe.each(tests.filter(v => v[2] === 'file-error'))(
		`should throw error using src %s and dest %s`,
		(src, dest) => {
			it('sync', () => {
				const srcPath = path.resolve(path.join(TEST_DIR, src));
				const dstPath = path.resolve(path.join(TEST_DIR, dest));

				const dstdirExistsBefore = fs.existsSync(path.dirname(dstPath));
				let err = null;
				try {
					createLinkSync(srcPath, dstPath);
				} catch (e) {
					err = e;
				}
				expect(err instanceof Error).toBeTruthy();
				const dstdirExistsAfter = fs.existsSync(path.dirname(dstPath));
				expect(dstdirExistsBefore).toBe(dstdirExistsAfter);
			});
			it('async', async () => {
				const srcPath = path.resolve(path.join(TEST_DIR, src));
				const dstPath = path.resolve(path.join(TEST_DIR, dest));

				const dstdirExistsBefore = fs.existsSync(path.dirname(dstPath));
				let err = null;
				try {
					await createLinkAsync(srcPath, dstPath);
				} catch (e) {
					err = e;
				}
				expect(err instanceof Error).toBeTruthy();
				const dstdirExistsAfter = fs.existsSync(path.dirname(dstPath));
				expect(dstdirExistsBefore).toBe(dstdirExistsAfter);
			});
		}
	);
});
