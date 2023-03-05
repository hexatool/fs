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
		() => crawler.down().sync(),
		() => crawler.down().async(),
		() => crawler.down().stream(),
		() => crawler.down().iterator()
	);
	crawlerTest(
		'should crawl current directory with Dirent',
		() => crawler.down().withDirent().sync(),
		() => crawler.down().withDirent().async(),
		() => crawler.down().withDirent().stream(),
		() => crawler.down().withDirent().iterator()
	);
	crawlerTest(
		'should crawl custom directory',
		() => crawler.down().sync(crawlModuleFilePath),
		() => crawler.down().async(crawlModuleFilePath),
		() => crawler.down().stream(crawlModuleFilePath),
		() => crawler.down().iterator(crawlModuleFilePath),
		true
	);
	crawlerTest(
		'should crawl custom directory with Dirent',
		() => crawler.down().withDirent().sync(crawlModuleFilePath),
		() => crawler.down().withDirent().async(crawlModuleFilePath),
		() => crawler.down().withDirent().stream(crawlModuleFilePath),
		() => crawler.down().withDirent().iterator(crawlModuleFilePath),
		true
	);
	crawlerTest(
		'should exclude folder with RegExp returning true',
		() =>
			crawler
				.down()
				.exclude(/\/fs\/packages\/.*/)
				.sync(crawlModuleFilePath),
		() =>
			crawler
				.down()
				.exclude(/\/fs\/packages\/.*/)
				.async(crawlModuleFilePath),
		() =>
			crawler
				.down()
				.exclude(/\/fs\/packages\/.*/)
				.stream(crawlModuleFilePath),
		() =>
			crawler
				.down()
				.exclude(/\/fs\/packages\/.*/)
				.iterator(crawlModuleFilePath),
		true,
		true
	);
	crawlerTest(
		'should exclude folder with RegExp returning false',
		() =>
			crawler
				.down()
				.exclude(/weglsjikvh/)
				.sync(crawlModuleFilePath),
		() =>
			crawler
				.down()
				.exclude(/weglsjikvh/)
				.async(crawlModuleFilePath),
		() =>
			crawler
				.down()
				.exclude(/weglsjikvh/)
				.stream(crawlModuleFilePath),
		() =>
			crawler
				.down()
				.exclude(/weglsjikvh/)
				.iterator(crawlModuleFilePath),
		true
	);
	crawlerTest(
		'should exclude folder with string returning false',
		() => crawler.down().exclude('weglsjikvh').sync(crawlModuleFilePath),
		() => crawler.down().exclude('weglsjikvh').async(crawlModuleFilePath),
		() => crawler.down().exclude('weglsjikvh').stream(crawlModuleFilePath),
		() => crawler.down().exclude('weglsjikvh').iterator(crawlModuleFilePath),
		true
	);
	crawlerTest(
		'should exclude folder with string returning true',
		() => crawler.down().exclude(crawlModuleFilePath).sync(crawlModuleFilePath),
		() => crawler.down().exclude(crawlModuleFilePath).async(crawlModuleFilePath),
		() => crawler.down().exclude(crawlModuleFilePath).stream(crawlModuleFilePath),
		() => crawler.down().exclude(crawlModuleFilePath).iterator(crawlModuleFilePath),
		true,
		true
	);
	crawlerTest(
		'should exclude folder with fn returning false',
		() =>
			crawler
				.down()
				.exclude(() => false)
				.sync(crawlModuleFilePath),
		() =>
			crawler
				.down()
				.exclude(() => false)
				.async(crawlModuleFilePath),
		() =>
			crawler
				.down()
				.exclude(() => false)
				.stream(crawlModuleFilePath),
		() =>
			crawler
				.down()
				.exclude(() => false)
				.iterator(crawlModuleFilePath),
		true
	);
	crawlerTest(
		'should exclude folder with fn returning true',
		() =>
			crawler
				.down()
				.exclude(() => true)
				.sync(crawlModuleFilePath),
		() =>
			crawler
				.down()
				.exclude(() => true)
				.async(crawlModuleFilePath),
		() =>
			crawler
				.down()
				.exclude(() => true)
				.stream(crawlModuleFilePath),
		() =>
			crawler
				.down()
				.exclude(() => true)
				.iterator(crawlModuleFilePath),
		true,
		true
	);
});
