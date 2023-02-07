import { statSync } from 'fs';
import mock, { restore, symlink } from 'mock-fs';
import path, { sep } from 'path';
import * as process from 'process';
import { describe, expect, it } from 'vitest';

import CrawlerBuilder from '../src';

const apiTypes = ['async', 'sync'] as const;
type ApiTypes = (typeof apiTypes)[number];

async function crawl(type: ApiTypes, path: string) {
	const api = new CrawlerBuilder();
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
	describe.each(apiTypes)('crawl single depth directory', type => {
		it(type, async () => await crawl(type, thisFilePath));
	});

	describe.each(apiTypes)('crawl single depth directory with options', type => {
		it(type, async () => {
			const api = new CrawlerBuilder({ includeBasePath: true });
			const files = await api[type](thisFilePath);
			expect(files.every(file => file.startsWith(thisFilePath))).toBeTruthy();
			await crawl(type, thisFilePath);
		});
	});

	describe.each(apiTypes)('crawl multi depth directory', type => {
		it(type, async () => {
			await crawl(type, nodeModulesFilePath);
		});
	});

	describe.each(apiTypes)('crawl multi depth directory with options', type => {
		it(type, async () => {
			const api = new CrawlerBuilder({ maxDepth: 1 });
			const files = await api[type](nodeModulesFilePath);
			expect(files).toBeDefined();
			expect(files.length).toBeGreaterThan(0);
			expect(files.every(file => file.split('/').length <= 3)).toBeTruthy();
		});
	});

	describe.each(apiTypes)('crawl and get both files and directories (withDirs)', type => {
		it(type, async () => {
			const api = new CrawlerBuilder().withDirs();
			const files = await api[type](nodeModulesFilePath);
			expect(files[0]).toBeDefined();
			expect(files.every(t => t)).toBeTruthy();
			expect(files[0]?.length).toBeGreaterThan(0);
			expect(files[0]?.endsWith('node_modules/')).toBeTruthy();
		});
	});

	describe.each(apiTypes)('crawl and get all files (withMaxDepth = 1)', type => {
		it(type, async () => {
			const api = new CrawlerBuilder().withMaxDepth(1).withBasePath();
			const files = await api[type](nodeModulesFilePath);
			expect(files.every(file => file.split('/').length <= 5)).toBeTruthy();
		});
	});

	describe.each(apiTypes)('crawl and get files that match filter', type => {
		it(type, async () => {
			const api = new CrawlerBuilder().withBasePath().filter(p => p.endsWith('.js'));
			const files = await api[type](nodeModulesFilePath);
			expect(files.length).toBeGreaterThan(0);
			expect(files.every(file => file.endsWith('.js'))).toBeTruthy();
		});
	});

	describe.each(apiTypes)('crawl and get files that match multiple filters', type => {
		it(type, async () => {
			const api = new CrawlerBuilder()
				.withBasePath()
				.filter(p => p.includes('packages/crawl'))
				.filter(p => p.includes('.ts'));
			const files = await api[type](rootProjectFilePath);
			expect(files.length).toBeGreaterThan(0);
			expect(
				files.every(file => file.endsWith('.ts') && file.includes('packages/crawl'))
			).toBeTruthy();
		});
	});

	describe.each(apiTypes)('crawl but exclude node_modules dir', type => {
		it(type, async () => {
			const api = new CrawlerBuilder()
				.withBasePath()
				.exclude(p => p.includes('node_modules'));
			const files = await api[type](rootProjectFilePath);
			expect(files.every(file => !file.includes('node_modules'))).toBeTruthy();
		});
	});

	describe.each(apiTypes)('crawl all files in a directory (with base path)', type => {
		it(type, async () => {
			const api = new CrawlerBuilder().withBasePath();
			const files = await api[type]('./');
			expect(files.every(file => file.startsWith('./'))).toBeTruthy();
		});
	});

	describe.each(apiTypes)(
		'get all files in a directory and output full paths (withFullPaths)',
		type => {
			it(type, async () => {
				const api = new CrawlerBuilder().withFullPaths();
				const files = await api[type]('./');
				expect(files.every(file => file.startsWith('/'))).toBeTruthy();
			});
		}
	);

	describe.each(apiTypes)('getting files from restricted directory should throw', type => {
		it(type, async () => {
			const api = new CrawlerBuilder().withErrors();
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
				const api = new CrawlerBuilder();
				const files = await api[type]('/etc');
				expect(files.length).toBeGreaterThan(0);
			});
		}
	);

	describe.each(apiTypes)(`recurse root (files should not contain multiple /)`, type => {
		it(type, async () => {
			mock({
				'/etc': {
					hosts: 'dooone',
				},
			});
			const api = new CrawlerBuilder().withBasePath().normalize();
			const files = await api[type]('/');
			expect(files.length).toBeGreaterThan(0);
			expect(files.every(file => !file.includes('//'))).toBeTruthy();
			restore();
		});
	});

	describe.each(apiTypes)(`crawl all files and include resolved symlinks`, type => {
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
			const api = new CrawlerBuilder().withSymlinks();
			const files = await api[type]('/some/dir');
			expect(files.length).toBe(2);
			expect(files.includes('/sym/linked/file-1')).toBeTruthy();
			expect(files.includes('/other/dir/file-2')).toBeTruthy();
			restore();
		});
	});

	describe.each(apiTypes)(
		'crawl all files and include resolved symlinks with exclusions',
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
				const api = new CrawlerBuilder()
					.withSymlinks()
					.exclude((_name, path) => path === '/sym/linked/');
				const files = await api[type]('/some/dir');
				expect(files.length).toBe(1);
				expect(files.includes('/other/dir/file-2')).toBeTruthy();
				restore();
			});
		}
	);

	describe.each(apiTypes)('crawl all files and include unresolved symlinks', type => {
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
			const api = new CrawlerBuilder().withDirs();
			const files = await api[type]('/some/dir');
			expect(files.length).toBe(3);
			expect(files.includes('/some/dir/')).toBeTruthy();
			expect(files.includes('fileSymlink')).toBeTruthy();
			expect(files.includes('dirSymlink')).toBeTruthy();
			restore();
		});
	});

	describe.each(apiTypes)('crawl all files (including symlinks) and throw errors', type => {
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
			const api = new CrawlerBuilder().withErrors().withSymlinks();
			const fn = () => api[type]('/some/dir');
			if (type === 'async') {
				await expect(fn).rejects.toThrow('no such file or directory');
			} else {
				expect(fn).toThrow('no such file or directory');
			}
			restore();
		});
	});

	describe.each(apiTypes)('crawl and return only directories', type => {
		it(type, async () => {
			const api = new CrawlerBuilder().onlyDirs();
			const files = await api[type](nodeModulesFilePath);
			expect(files.length).greaterThan(0);
			expect(files.every(dir => statSync(dir).isDirectory)).toBeTruthy();
		});
	});

	describe.each(apiTypes)('crawl with options and return only directories', type => {
		it(type, async () => {
			const api = new CrawlerBuilder({
				excludeFiles: true,
				includeDirs: true,
			});
			const files = await api[type](nodeModulesFilePath);
			expect(files.length).greaterThan(0);
			expect(files.every(dir => statSync(dir).isDirectory)).toBeTruthy();
		});
	});

	describe.each(apiTypes)('crawl all files in a directory (path with trailing slash)', type => {
		it(type, async () => {
			const api = new CrawlerBuilder().normalize();
			const files = await api[type](nodeModulesFilePath + sep);
			expect(files.every(file => !file.includes('/'))).toBeTruthy();
		});
	});

	describe.each(apiTypes)('crawl and filter only directories', type => {
		it(type, async () => {
			const api = new CrawlerBuilder().onlyDirs().filter(path => path.includes('src'));
			const files = await api[type](crawlModuleFilePath);
			expect(files.length).toBe(2);
		});
	});

	describe.each(apiTypes)('giving undefined directory path should throw', type => {
		it(type, async () => {
			const api = new CrawlerBuilder();
			// @ts-ignore
			const fn = () => api[type]();
			if (type === 'async') {
				await expect(fn).rejects.toThrow();
			} else {
				expect(fn).toThrow();
			}
		});
	});

	describe.each(apiTypes)('crawl and return relative paths', type => {
		it(type, async () => {
			const api = new CrawlerBuilder().withRelativePaths();
			const files = await api[type](nodeModulesFilePath);
			expect(files.every(file => !file.startsWith('node_modules'))).toBeTruthy();
		});
	});

	describe.each(apiTypes)('crawl and return relative paths that end with /', type => {
		it(type, async () => {
			const api = new CrawlerBuilder().withRelativePaths();
			const files = await api[type](nodeModulesFilePath + sep);
			expect(
				files.every(file => !file.startsWith('node_modules') && !file.includes('//'))
			).toBeTruthy();
		});
	});
});
