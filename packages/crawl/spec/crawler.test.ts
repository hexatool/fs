import path from 'node:path';
import process from 'node:process';

import { describe } from 'vitest';

import crawler from '../src/builder';
import crawlerTest from './crawler-test.factory';

let crawlModuleFilePath = path.resolve(path.relative(process.cwd(), path.resolve(__dirname, '..')));
crawlModuleFilePath = crawlModuleFilePath === '' ? '.' : crawlModuleFilePath;

describe('@hexatool/fs-crawl', () => {
	crawlerTest(
		'should crawl current directory',
		direction => crawler[direction]().sync(),
		direction => crawler[direction]().async(),
		direction => crawler[direction]().stream(),
		direction => crawler[direction]().iterator()
	);
	crawlerTest(
		'should crawl current directory with Dirent',
		direction => crawler[direction]().withDirent().sync(),
		direction => crawler[direction]().withDirent().async(),
		direction => crawler[direction]().withDirent().stream(),
		direction => crawler[direction]().withDirent().iterator()
	);
	crawlerTest(
		'should crawl custom directory',
		direction => crawler[direction]().sync(crawlModuleFilePath),
		direction => crawler[direction]().async(crawlModuleFilePath),
		direction => crawler[direction]().stream(crawlModuleFilePath),
		direction => crawler[direction]().iterator(crawlModuleFilePath),
		true
	);
	crawlerTest(
		'should crawl custom directory with Dirent',
		direction => crawler[direction]().withDirent().sync(crawlModuleFilePath),
		direction => crawler[direction]().withDirent().async(crawlModuleFilePath),
		direction => crawler[direction]().withDirent().stream(crawlModuleFilePath),
		direction => crawler[direction]().withDirent().iterator(crawlModuleFilePath),
		true
	);
	crawlerTest(
		'should exclude folder with RegExp returning true',
		direction =>
			crawler[direction]()
				.exclude(/\/fs\/packages\/.*/)
				.sync(crawlModuleFilePath),
		direction =>
			crawler[direction]()
				.exclude(/\/fs\/packages\/.*/)
				.async(crawlModuleFilePath),
		direction =>
			crawler[direction]()
				.exclude(/\/fs\/packages\/.*/)
				.stream(crawlModuleFilePath),
		direction =>
			crawler[direction]()
				.exclude(/\/fs\/packages\/.*/)
				.iterator(crawlModuleFilePath),
		true,
		true
	);
	crawlerTest(
		'should exclude folder with RegExp returning false',
		direction =>
			crawler[direction]()
				.exclude(/weglsjikvh/)
				.sync(crawlModuleFilePath),
		direction =>
			crawler[direction]()
				.exclude(/weglsjikvh/)
				.async(crawlModuleFilePath),
		direction =>
			crawler[direction]()
				.exclude(/weglsjikvh/)
				.stream(crawlModuleFilePath),
		direction =>
			crawler[direction]()
				.exclude(/weglsjikvh/)
				.iterator(crawlModuleFilePath),
		true
	);
	crawlerTest(
		'should exclude folder with string returning false',
		direction => crawler[direction]().exclude('weglsjikvh').sync(crawlModuleFilePath),
		direction => crawler[direction]().exclude('weglsjikvh').async(crawlModuleFilePath),
		direction => crawler[direction]().exclude('weglsjikvh').stream(crawlModuleFilePath),
		direction => crawler[direction]().exclude('weglsjikvh').iterator(crawlModuleFilePath),
		true
	);
	crawlerTest(
		'should exclude folder with string returning true',
		direction => crawler[direction]().exclude(crawlModuleFilePath).sync(crawlModuleFilePath),
		direction => crawler[direction]().exclude(crawlModuleFilePath).async(crawlModuleFilePath),
		direction => crawler[direction]().exclude(crawlModuleFilePath).stream(crawlModuleFilePath),
		direction =>
			crawler[direction]().exclude(crawlModuleFilePath).iterator(crawlModuleFilePath),
		true,
		true
	);
	crawlerTest(
		'should exclude folder with fn returning false',
		direction =>
			crawler[direction]()
				.exclude(() => false)
				.sync(crawlModuleFilePath),
		direction =>
			crawler[direction]()
				.exclude(() => false)
				.async(crawlModuleFilePath),
		direction =>
			crawler[direction]()
				.exclude(() => false)
				.stream(crawlModuleFilePath),
		direction =>
			crawler[direction]()
				.exclude(() => false)
				.iterator(crawlModuleFilePath),
		true
	);
	crawlerTest(
		'should exclude folder with fn returning true',
		direction =>
			crawler[direction]()
				.exclude(() => true)
				.sync(crawlModuleFilePath),
		direction =>
			crawler[direction]()
				.exclude(() => true)
				.async(crawlModuleFilePath),
		direction =>
			crawler[direction]()
				.exclude(() => true)
				.stream(crawlModuleFilePath),
		direction =>
			crawler[direction]()
				.exclude(() => true)
				.iterator(crawlModuleFilePath),
		true,
		true
	);
});
