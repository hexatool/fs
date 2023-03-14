import path from 'node:path';
import process from 'node:process';

import { describe } from 'vitest';

import crawler from '../src/builder';
import crawlerTest from './crawler-test.factory';

let crawlModuleFilePath = path.resolve(path.relative(process.cwd(), path.resolve(__dirname, '..')));
crawlModuleFilePath = crawlModuleFilePath === '' ? '.' : crawlModuleFilePath;

describe('@hexatool/fs-crawl', () => {
	crawlerTest('should crawl current directory', (res, dir, api) => crawler[res]()[dir]()[api]());
	crawlerTest(
		'should crawl custom directory',
		(res, dir, api) => crawler[res]()[dir]()[api](crawlModuleFilePath),
		{ matchSnapshot: true, length: 12 }
	);
	crawlerTest(
		'should exclude folder with RegExp returning true',
		(res, dir, api) =>
			crawler[res]()
				[dir]()
				.exclude(/\/fs\/packages\/.*/)
				[api](crawlModuleFilePath),
		{ matchSnapshot: true, matchEmpty: true }
	);
	crawlerTest(
		'should exclude folder with RegExp returning false',
		(res, dir, api) =>
			crawler[res]()
				[dir]()
				.exclude(/weglsjikvh/)
				[api](crawlModuleFilePath),
		{ matchSnapshot: true, length: 12 }
	);
	crawlerTest(
		'should exclude folder with string returning false',
		(res, dir, api) => crawler[res]()[dir]().exclude('weglsjikvh')[api](crawlModuleFilePath),
		{ matchSnapshot: true, length: 12 }
	);
	crawlerTest(
		'should exclude folder with string returning true',
		(res, dir, api) =>
			crawler[res]()[dir]().exclude(crawlModuleFilePath)[api](crawlModuleFilePath),
		{ matchSnapshot: true, matchEmpty: true }
	);
	crawlerTest(
		'should exclude folder with fn returning false',
		(res, dir, api) =>
			crawler[res]()
				[dir]()
				.exclude(() => false)
				[api](crawlModuleFilePath),
		{ matchSnapshot: true, length: 12 }
	);
	crawlerTest(
		'should exclude folder with fn returning true',
		(res, dir, api) =>
			crawler[res]()
				[dir]()
				.exclude(() => true)
				[api](crawlModuleFilePath),
		{ matchSnapshot: true, matchEmpty: true }
	);
	crawlerTest(
		'should exclude all directories',
		(res, dir, api) => crawler[res]()[dir]().excludeDirectories(true)[api](crawlModuleFilePath),
		{ matchSnapshot: true, length: 9 }
	);
	crawlerTest(
		'should exclude directories',
		(res, dir, api) =>
			res === 'string'
				? crawler[res]()
						[dir]()
						.excludeDirectories((_p, i) => i.endsWith('s'))
						[api](crawlModuleFilePath)
				: crawler[res]()
						[dir]()
						.excludeDirectories((_p, i) => i.name.endsWith('s'))
						[api](crawlModuleFilePath),
		{ matchSnapshot: true, length: 11 }
	);
	crawlerTest(
		'should exclude all files',
		(res, dir, api) => crawler[res]()[dir]().excludeFiles(true)[api](crawlModuleFilePath),
		{ matchSnapshot: true, length: 3 }
	);
	crawlerTest(
		'should exclude files',
		(res, dir, api) =>
			res === 'string'
				? crawler[res]()
						[dir]()
						.excludeFiles((_p, i) => i.endsWith('s'))
						[api](crawlModuleFilePath)
				: crawler[res]()
						[dir]()
						.excludeFiles((_p, i) => i.name.endsWith('s'))
						[api](crawlModuleFilePath),
		{ matchSnapshot: true, length: 11 }
	);
	crawlerTest(
		'should exclude all folder and files',
		(res, dir, api) =>
			crawler[res]()
				[dir]()
				.excludeDirectories(true)
				.excludeFiles(true)
				[api](crawlModuleFilePath),
		{ matchSnapshot: true, matchEmpty: true }
	);
	crawlerTest(
		'should exclude folder and files',
		(res, dir, api) =>
			res === 'string'
				? crawler[res]()
						[dir]()
						.excludeDirectories(/src/)
						.excludeFiles((_parent, file) => file.endsWith('s'))
						[api](crawlModuleFilePath)
				: crawler[res]()
						[dir]()
						.excludeDirectories(/src/)
						.excludeFiles((_parent, file) => file.name.endsWith('s'))
						[api](crawlModuleFilePath),
		{ matchSnapshot: true, length: 10 }
	);
	crawlerTest(
		'should crawl relative directory',
		(res, dir, api) => crawler[res]()[dir]()[api]('.'),
		{ log: true }
	);
	crawlerTest(
		'should crawl custom directory with absolute paths',
		(res, dir, api) => crawler[res]()[dir]().withAbsolutePaths()[api](crawlModuleFilePath),
		{ length: 12 }
	);
});
