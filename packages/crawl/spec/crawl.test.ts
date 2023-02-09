import { statSync } from 'node:fs';
import path, { sep } from 'node:path';
import * as process from 'node:process';

import mock, { restore, symlink } from 'mock-fs';
import { describe, expect, it } from 'vitest';

import crawler from '../src';

const apiTypes = ['async', 'sync'] as const;
type ApiTypes = (typeof apiTypes)[number];

async function crawlDown(type: ApiTypes, path: string) {
	const api = crawler.down();
	const files = await api[type](path);
	expect(files).toBeDefined();
	expect(files.length).toBeGreaterThan(0);
	expect(files.every(t => t)).toBeTruthy();

	return files;
}

async function crawlUp(type: ApiTypes, path: string) {
	const api = crawler.up();
	const files = await api[type](path);
	expect(files).toBeDefined();
	expect(files.length).toBeGreaterThan(0);
	expect(files.every(t => t)).toBeTruthy();

	return files;
}

const thisFilePath = path.relative(process.cwd(), __dirname);
let crawlModuleFilePath = path.relative(process.cwd(), path.resolve(__dirname, '..'));
crawlModuleFilePath = crawlModuleFilePath === '' ? '.' : crawlModuleFilePath;

const nodeModulesFilePath = path.relative(
	process.cwd(),
	path.resolve(__dirname, '../../../node_modules')
);
let rootProjectFilePath = path.relative(process.cwd(), path.resolve(__dirname, '../../../'));
rootProjectFilePath = rootProjectFilePath === '' ? '.' : rootProjectFilePath;

describe('@hexatool/fs-crawl', () => {
	describe.each(apiTypes)('crawl down single depth directory', type => {
		it(type, async () => await crawlDown(type, thisFilePath));
	});

	describe.each(apiTypes)('crawl down multi depth directory', type => {
		it(type, async () => {
			await crawlDown(type, nodeModulesFilePath);
		});
	});

	describe.each(apiTypes)('crawl down and get both files and directories (withDirs)', type => {
		it(type, async () => {
			const api = crawler.down().withDirs();
			const files = await api[type](nodeModulesFilePath);
			expect(files[0]).toBeDefined();
			expect(files.every(t => t)).toBeTruthy();
			expect(files[0]?.length).toBeGreaterThan(0);
			expect(files[0]?.endsWith('node_modules/')).toBeTruthy();
		});
	});

	describe.each(apiTypes)('crawl down and get all files (withMaxDepth = 1)', type => {
		it(type, async () => {
			const api = crawler.down().withMaxDepth(1).withBasePath();
			const files = await api[type](nodeModulesFilePath);
			expect(files.length).toBeGreaterThan(0);
			expect(files.every(file => file.split('/').length <= 5)).toBeTruthy();
		});
	});

	describe.each(apiTypes)('crawl down and get files that match filter', type => {
		it(type, async () => {
			const api = crawler
				.down()
				.withBasePath()
				.filter(p => p.endsWith('.js'));
			const files = await api[type](nodeModulesFilePath);
			expect(files.length).toBeGreaterThan(0);
			expect(files.every(file => file.endsWith('.js'))).toBeTruthy();
		});
	});

	describe.each(apiTypes)('crawl down and get files that match multiple filters', type => {
		it(type, async () => {
			const api = crawler
				.down()
				.withBasePath()
				.filter(p => p.includes('packages/crawl'))
				.filter(p => p.endsWith('.ts'));
			const files = await api[type](rootProjectFilePath);
			expect(files.length).toBeGreaterThan(0);
			expect(
				files.every(file => file.endsWith('.ts') && file.includes('packages/crawl'))
			).toBeTruthy();
		});
	});

	describe.each(apiTypes)('crawl down but exclude node_modules dir', type => {
		it(type, async () => {
			const api = crawler
				.down()
				.withBasePath()
				.exclude(p => p.includes('node_modules'));
			const files = await api[type](rootProjectFilePath);
			expect(files.every(file => !file.includes('node_modules'))).toBeTruthy();
		});
	});

	describe.each(apiTypes)('crawl down all files in a directory (with base path)', type => {
		it(type, async () => {
			const api = crawler.down().withBasePath();
			const files = await api[type]('./');
			expect(files.every(file => file.startsWith('./'))).toBeTruthy();
		});
	});

	describe.each(apiTypes)(
		'crawl down files in a directory and output full paths (withFullPaths)',
		type => {
			it(type, async () => {
				const api = crawler.down().withFullPaths();
				const files = await api[type]('./');
				expect(files.every(file => file.startsWith('/'))).toBeTruthy();
			});
		}
	);

	describe.each(apiTypes)('getting files from restricted directory should throw', type => {
		it(type, async () => {
			const api = crawler.down().withErrors();
			const fn = () => api[type]('/etc');
			if (type === 'async') {
				await expect(fn).rejects.toThrow();
			} else {
				expect(fn).toThrow();
			}
		});
	});

	describe.each(apiTypes)(
		`getting files from restricted directory shouldn't throw (suppressErrors)`,
		type => {
			it(type, async () => {
				const api = crawler.down();
				const files = await api[type]('/etc');
				expect(files.length).toBeGreaterThan(0);
			});
		}
	);

	describe.each(apiTypes)(
		`crawl down recurse root (files should not contain multiple /)`,
		type => {
			it(type, async () => {
				mock({
					'/etc': {
						hosts: 'dooone',
					},
				});
				const api = crawler.down().withBasePath().normalize();
				const files = await api[type]('/');
				expect(files.length).toBeGreaterThan(0);
				expect(files.every(file => !file.includes('//'))).toBeTruthy();
				restore();
			});
		}
	);

	describe.each(apiTypes)(`crawl down down all files and include resolved symlinks`, type => {
		it(type, async () => {
			mock({
				'/sym/linked': {
					'file-1': 'file contents',
				},
				'/other/dir': {
					'file-2': 'file contents2',
				},
				'/some/dir': {
					fileSymlink: symlink({
						path: '/other/dir/file-2',
					}),
					fileSymlink2: symlink({
						path: '/other/dir/file-3',
					}),
					dirSymlink: symlink({
						path: '/sym/linked',
					}),
				},
			});
			const api = crawler.down().withSymlinks();
			const files = await api[type]('/some/dir');
			expect(files.length).toBe(2);
			expect(files.includes('/sym/linked/file-1')).toBeTruthy();
			expect(files.includes('/other/dir/file-2')).toBeTruthy();
			restore();
		});
	});

	describe.each(apiTypes)(
		'crawl down all files and include resolved symlinks with exclusions',
		type => {
			it(type, async () => {
				mock({
					'/sym/linked': {
						'file-1': 'file contents',
						'file-excluded-1': 'file contents',
					},
					'/other/dir': {
						'file-2': 'file contents2',
					},
					'/some/dir': {
						fileSymlink: symlink({
							path: '/other/dir/file-2',
						}),
						dirSymlink: symlink({
							path: '/sym/linked',
						}),
					},
				});
				const api = crawler
					.down()
					.withSymlinks()
					.exclude((_name, path) => path === '/sym/linked/');
				const files = await api[type]('/some/dir');
				expect(files.length).toBe(1);
				expect(files.includes('/other/dir/file-2')).toBeTruthy();
				restore();
			});
		}
	);

	describe.each(apiTypes)('crawl down all files and include unresolved symlinks', type => {
		it(type, async () => {
			mock({
				'/sym/linked': {
					'file-1': 'file contents',
				},
				'/other/dir': {
					'file-2': 'file contents2',
				},
				'/some/dir': {
					fileSymlink: symlink({
						path: '/other/dir/file-2',
					}),
					dirSymlink: symlink({
						path: '/sym/linked',
					}),
				},
			});
			const api = crawler.down().withDirs();
			const files = await api[type]('/some/dir');
			expect(files.length).toBe(3);
			expect(files.includes('/some/dir/')).toBeTruthy();
			expect(files.includes('fileSymlink')).toBeTruthy();
			expect(files.includes('dirSymlink')).toBeTruthy();
			restore();
		});
	});

	describe.each(apiTypes)('crawl down all files (including symlinks) and throw errors', type => {
		it(type, async () => {
			mock({
				'/sym/linked': {
					'file-1': 'file contents',
				},
				'/other/dir': {},
				'/some/dir': {
					fileSymlink: symlink({
						path: '/other/dir/file-3',
					}),
					dirSymlink: symlink({
						path: '/sym/linked',
					}),
				},
			});
			const api = crawler.down().withErrors().withSymlinks();
			const fn = () => api[type]('/some/dir');
			if (type === 'async') {
				await expect(fn).rejects.toThrow('no such file or directory');
			} else {
				expect(fn).toThrow('no such file or directory');
			}
			restore();
		});
	});

	describe.each(apiTypes)('crawl down and return only directories', type => {
		it(type, async () => {
			const api = crawler.down().onlyDirs();
			const files = await api[type](nodeModulesFilePath);
			expect(files.length).greaterThan(0);
			expect(files.every(dir => statSync(dir).isDirectory())).toBeTruthy();
		});
	});

	describe.each(apiTypes)(
		'crawl down all files in a directory (path with trailing slash)',
		type => {
			it(type, async () => {
				const api = crawler.down().normalize();
				const files = await api[type](nodeModulesFilePath + sep);
				expect(files.every(file => !file.includes('/'))).toBeTruthy();
			});
		}
	);

	describe.each(apiTypes)('crawl down and filter only directories', type => {
		it(type, async () => {
			const api = crawler
				.down()
				.onlyDirs()
				.filter(path => path.includes('src'));
			const files = await api[type](crawlModuleFilePath);
			expect(files.length).toBeGreaterThanOrEqual(2);
		});
	});

	describe.each(apiTypes)('giving undefined directory path should throw', type => {
		it(type, async () => {
			const api = crawler.down();
			// @ts-ignore
			const fn = () => api[type]();
			if (type === 'async') {
				await expect(fn).rejects.toThrow();
			} else {
				expect(fn).toThrow();
			}
		});
	});

	describe.each(apiTypes)('crawl down and return relative paths', type => {
		it(type, async () => {
			const api = crawler.down().withRelativePaths();
			const files = await api[type](nodeModulesFilePath);
			expect(files.every(file => !file.startsWith('node_modules'))).toBeTruthy();
		});
	});

	describe.each(apiTypes)('crawl down and return relative paths that end with /', type => {
		it(type, async () => {
			const api = crawler.down().withRelativePaths();
			const files = await api[type](nodeModulesFilePath + sep);
			expect(
				files.every(file => !file.startsWith('node_modules') && !file.includes('//'))
			).toBeTruthy();
		});
	});

	describe.each(apiTypes)('crawl down but exclude crawl dir', type => {
		it(type, async () => {
			const api = crawler
				.down()
				.withFullPaths()
				.exclude((_path, dir) => dir.includes('fs'));
			const files = await api[type](rootProjectFilePath);
			expect(files.every(file => !file.includes('fs'))).toBeTruthy();
		});
	});

	describe.each(apiTypes)('crawl down but exclude and maxDepth', type => {
		it(type, async () => {
			const api = crawler
				.down()
				.withFullPaths()
				.withMaxDepth(2)
				.exclude((_path, dir) => dir.includes('copy'));
			const files = await api[type](rootProjectFilePath);
			expect(files.every(file => !file.includes('/copy/'))).toBeTruthy();
		});
	});

	describe.each(apiTypes)('crawl up a directory', type => {
		it(type, async () => await crawlUp(type, thisFilePath));
	});

	describe.each(apiTypes)('crawl up a directory (with stopAt)', type => {
		it(type, async () => {
			const stopAt = path.resolve(rootProjectFilePath);
			const api = crawler.up().withStopAt(stopAt);
			const files = await api[type](thisFilePath);
			expect(files).toBeDefined();
			expect(files.length).toBeGreaterThan(0);
			expect(files.every(t => t.startsWith(stopAt))).toBeTruthy();
		});
	});

	describe.each(apiTypes)('crawl up a directory (with exclude)', type => {
		it(type, async () => {
			const root = path.resolve(rootProjectFilePath);
			const api = crawler.up().exclude((_path, dir) => dir.startsWith(root));
			const files = await api[type](thisFilePath);
			expect(files).toBeDefined();
			expect(files.length).toBeGreaterThan(0);
			expect(files.every(t => !t.startsWith(root))).toBeTruthy();
		});
	});
});
