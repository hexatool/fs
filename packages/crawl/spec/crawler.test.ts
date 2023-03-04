import type { Dirent } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { describe, expect, it } from 'vitest';

import crawler from '../src/builder';
import { apiTypes, directions } from '../src/types';

let crawlModuleFilePath = path.resolve(path.relative(process.cwd(), path.resolve(__dirname, '..')));
crawlModuleFilePath = crawlModuleFilePath === '' ? '.' : crawlModuleFilePath;

describe('@hexatool/fs-crawl', () => {
	const CRAWL_CURRENT_DIR = 'should crawl current directory';
	describe.each(directions)(CRAWL_CURRENT_DIR, direction => {
		describe.each(apiTypes)(`${CRAWL_CURRENT_DIR} ${direction}`, type => {
			if (type === 'stream') {
				it(`${type} ${CRAWL_CURRENT_DIR} ${direction}`, () =>
					new Promise<void>(done => {
						const files: (Dirent | string)[] = [];
						const stream = crawler.down().stream().start();
						stream.on('data', d => files.push(d as string));
						stream.on('end', () => {
							expect(files).toBeDefined();
							expect(files.length).toBeGreaterThan(0);
							expect(files.every(t => t)).toBeTruthy();
							done();
						});
					}));
			} else if (type === 'iterator') {
				it(`${type} ${CRAWL_CURRENT_DIR} ${direction}`, async () => {
					const files: string[] = [];
					const iterator = crawler.down().iterator().start(crawlModuleFilePath);

					for await (const item of iterator) {
						files.push(item);
					}
					expect(files).toBeDefined();
					expect(files.length).toBeGreaterThan(0);
					expect(files.every(t => t)).toBeTruthy();
				});
			} else {
				it(`${type} ${CRAWL_CURRENT_DIR} ${direction}`, async () => {
					const files =
						type === 'async'
							? await crawler.down().async().start()
							: crawler.down().sync().start();
					expect(files).toBeDefined();
					expect(files.length).toBeGreaterThan(0);
					expect(files.every(t => t)).toBeTruthy();
				});
			}
		});
	});

	const CRAWL_CURRENT_WITH_DIRENT = 'should crawl current directory with Dirent';
	describe.each(directions)(CRAWL_CURRENT_WITH_DIRENT, direction => {
		describe.each(apiTypes)(`${CRAWL_CURRENT_WITH_DIRENT} ${direction}`, type => {
			if (type === 'stream') {
				it(`${type} ${CRAWL_CURRENT_WITH_DIRENT} ${direction}`, () =>
					new Promise<void>(done => {
						const files: (Dirent | string)[] = [];
						const stream = crawler.down().withDirent().stream().start();
						stream.on('data', d => files.push(d as string));
						stream.on('end', () => {
							expect(files).toBeDefined();
							expect(files.length).toBeGreaterThan(0);
							expect(files.every(t => t)).toBeTruthy();
							done();
						});
					}));
			} else if (type === 'iterator') {
				it(`${type} ${CRAWL_CURRENT_WITH_DIRENT} ${direction}`, async () => {
					const files: Dirent[] = [];
					const iterator = crawler
						.down()
						.withDirent()
						.iterator()
						.start(crawlModuleFilePath);

					for await (const item of iterator) {
						files.push(item);
					}
					expect(files).toBeDefined();
					expect(files.length).toBeGreaterThan(0);
					expect(files.every(t => t)).toBeTruthy();
				});
			} else {
				it(`${type} ${CRAWL_CURRENT_WITH_DIRENT} ${direction}`, async () => {
					const files =
						type === 'async'
							? await crawler.down().withDirent().async().start()
							: crawler.down().withDirent().sync().start();
					expect(files).toBeDefined();
					expect(files.length).toBeGreaterThan(0);
				});
			}
		});
	});

	const CRAWL_CUSTOM_DIR = 'should crawl custom directory';
	describe.each(directions)(CRAWL_CUSTOM_DIR, direction => {
		describe.each(apiTypes)(`${CRAWL_CUSTOM_DIR} ${direction}`, type => {
			if (type === 'stream') {
				it(`${type} ${CRAWL_CUSTOM_DIR} ${direction}`, () =>
					new Promise<void>(done => {
						const files: string[] = [];
						const stream = crawler.down().stream().start(crawlModuleFilePath);
						stream.on('data', d => files.push(d as string));
						stream.on('end', () => {
							expect(files).toMatchSnapshot();
							done();
						});
					}));
			} else if (type === 'iterator') {
				it(`${type} ${CRAWL_CUSTOM_DIR} ${direction}`, async () => {
					const files: (Dirent | string)[] = [];
					const iterator = crawler.down().iterator().start(crawlModuleFilePath);

					for await (const item of iterator) {
						files.push(item);
					}
					expect(files).toMatchSnapshot();
				});
			} else {
				it(`${type} ${CRAWL_CUSTOM_DIR} ${direction}`, async () => {
					const files =
						type === 'async'
							? await crawler.down().async().start(crawlModuleFilePath)
							: crawler.down().sync().start(crawlModuleFilePath);
					expect(files).toMatchSnapshot();
				});
			}
		});
	});

	const CRAWL_CUSTOM_DIR_WITH_DIRENT = 'should crawl custom directory with Dirent';
	describe.each(directions)(CRAWL_CUSTOM_DIR_WITH_DIRENT, direction => {
		describe.each(apiTypes)(`${CRAWL_CUSTOM_DIR_WITH_DIRENT} ${direction}`, type => {
			if (type === 'stream') {
				it(`${type} ${CRAWL_CUSTOM_DIR_WITH_DIRENT} ${direction}`, () =>
					new Promise<void>(done => {
						const files: (Dirent | string)[] = [];
						const stream = crawler
							.down()
							.withDirent()
							.stream()
							.start(crawlModuleFilePath);
						stream.on('data', d => files.push(d as string));
						stream.on('end', () => {
							expect(files).toMatchSnapshot();
							done();
						});
					}));
			} else if (type === 'iterator') {
				it(`${type} ${CRAWL_CUSTOM_DIR_WITH_DIRENT} ${direction}`, () => async () => {
					const files: Dirent[] = [];
					const iterator = crawler
						.down()
						.withDirent()
						.iterator()
						.start(crawlModuleFilePath);

					for await (const item of iterator) {
						files.push(item);
					}
					expect(files).toMatchSnapshot();
				});
			} else {
				it(`${type} ${CRAWL_CUSTOM_DIR_WITH_DIRENT} ${direction}`, async () => {
					const files =
						type === 'async'
							? await crawler.down().withDirent().async().start(crawlModuleFilePath)
							: crawler.down().withDirent().sync().start(crawlModuleFilePath);
					expect(files).toMatchSnapshot();
				});
			}
		});
	});

	const CRAWL_EXCLUDE_REGEX_TRUE = 'should exclude folder with RegExp returning true';
	describe.each(directions)(CRAWL_EXCLUDE_REGEX_TRUE, direction => {
		describe.each(apiTypes)(`${CRAWL_EXCLUDE_REGEX_TRUE} ${direction}`, type => {
			if (type === 'stream') {
				it(`${type} ${CRAWL_EXCLUDE_REGEX_TRUE} ${direction}`, () =>
					new Promise<void>(done => {
						const files: (Dirent | string)[] = [];
						const stream = crawler
							.down()
							.withDirent()
							.exclude(/\/fs\/packages\/.*/)
							.stream()
							.start(crawlModuleFilePath);
						stream.on('data', d => files.push(d as string));
						stream.on('end', () => {
							expect(files).toStrictEqual([]);
							done();
						});
					}));
			} else if (type === 'iterator') {
				it(`${type} ${CRAWL_EXCLUDE_REGEX_TRUE} ${direction}`, () => async () => {
					const files: Dirent[] = [];
					const iterator = crawler
						.down()
						.withDirent()
						.exclude(/\/fs\/packages\/.*/)
						.iterator()
						.start(crawlModuleFilePath);

					for await (const item of iterator) {
						files.push(item);
					}
					expect(files).toStrictEqual([]);
				});
			} else {
				it(`${type} ${CRAWL_EXCLUDE_REGEX_TRUE} ${direction}`, async () => {
					const files =
						type === 'async'
							? await crawler
									.down()
									.withDirent()
									.exclude(/\/fs\/packages\/.*/)
									.async()
									.start(crawlModuleFilePath)
							: crawler
									.down()
									.withDirent()
									.exclude(/\/fs\/packages\/.*/)
									.sync()
									.start(crawlModuleFilePath);
					expect(files).toStrictEqual([]);
				});
			}
		});
	});

	const CRAWL_EXCLUDE_REGEX_FALSE = 'should exclude folder with RegExp returning false';
	describe.each(directions)(CRAWL_EXCLUDE_REGEX_FALSE, direction => {
		describe.each(apiTypes)(`${CRAWL_EXCLUDE_REGEX_FALSE} ${direction}`, type => {
			if (type === 'stream') {
				it(`${type} ${CRAWL_EXCLUDE_REGEX_FALSE} ${direction}`, () =>
					new Promise<void>(done => {
						const files: (Dirent | string)[] = [];
						const stream = crawler
							.down()
							.withDirent()
							.exclude(/weglsjikvh/)
							.stream()
							.start(crawlModuleFilePath);
						stream.on('data', d => files.push(d as string));
						stream.on('end', () => {
							expect(files).toMatchSnapshot();
							done();
						});
					}));
			} else if (type === 'iterator') {
				it(`${type} ${CRAWL_EXCLUDE_REGEX_FALSE} ${direction}`, () => async () => {
					const files: Dirent[] = [];
					const iterator = crawler
						.down()
						.withDirent()
						.exclude(/weglsjikvh/)
						.iterator()
						.start(crawlModuleFilePath);

					for await (const item of iterator) {
						files.push(item);
					}
					expect(files).toMatchSnapshot();
				});
			} else {
				it(`${type} ${CRAWL_EXCLUDE_REGEX_FALSE} ${direction}`, async () => {
					const files =
						type === 'async'
							? await crawler
									.down()
									.withDirent()
									.exclude(/weglsjikvh/)
									.async()
									.start(crawlModuleFilePath)
							: crawler
									.down()
									.withDirent()
									.exclude(/weglsjikvh/)
									.sync()
									.start(crawlModuleFilePath);
					expect(files).toMatchSnapshot();
				});
			}
		});
	});

	const CRAWL_EXCLUDE_STRING_FALSE = 'should exclude folder with string returning false';
	describe.each(directions)(CRAWL_EXCLUDE_STRING_FALSE, direction => {
		describe.each(apiTypes)(`${CRAWL_EXCLUDE_STRING_FALSE} ${direction}`, type => {
			if (type === 'stream') {
				it(`${type} ${CRAWL_EXCLUDE_STRING_FALSE} ${direction}`, () =>
					new Promise<void>(done => {
						const files: (Dirent | string)[] = [];
						const stream = crawler
							.down()
							.withDirent()
							.exclude('weglsjikvh')
							.stream()
							.start(crawlModuleFilePath);
						stream.on('data', d => files.push(d as string));
						stream.on('end', () => {
							expect(files).toMatchSnapshot();
							done();
						});
					}));
			} else if (type === 'iterator') {
				it(`${type} ${CRAWL_EXCLUDE_STRING_FALSE} ${direction}`, () => async () => {
					const files: Dirent[] = [];
					const iterator = crawler
						.down()
						.withDirent()
						.exclude('weglsjikvh')
						.iterator()
						.start(crawlModuleFilePath);

					for await (const item of iterator) {
						files.push(item);
					}
					expect(files).toMatchSnapshot();
				});
			} else {
				it(`${type} ${CRAWL_EXCLUDE_STRING_FALSE} ${direction}`, async () => {
					const files =
						type === 'async'
							? await crawler
									.down()
									.withDirent()
									.exclude('weglsjikvh')
									.async()
									.start(crawlModuleFilePath)
							: crawler
									.down()
									.withDirent()
									.exclude(crawlModuleFilePath)
									.sync()
									.start(crawlModuleFilePath);
					expect(files).toMatchSnapshot();
				});
			}
		});
	});

	const CRAWL_EXCLUDE_STRING_TRUE = 'should exclude folder with string returning true';
	describe.each(directions)(CRAWL_EXCLUDE_STRING_TRUE, direction => {
		describe.each(apiTypes)(`${CRAWL_EXCLUDE_STRING_TRUE} ${direction}`, type => {
			if (type === 'stream') {
				it(`${type} ${CRAWL_EXCLUDE_STRING_TRUE} ${direction}`, () =>
					new Promise<void>(done => {
						const files: (Dirent | string)[] = [];
						const stream = crawler
							.down()
							.withDirent()
							.exclude(crawlModuleFilePath)
							.stream()
							.start(crawlModuleFilePath);
						stream.on('data', d => files.push(d as string));
						stream.on('end', () => {
							expect(files).toStrictEqual([]);
							done();
						});
					}));
			} else if (type === 'iterator') {
				it(`${type} ${CRAWL_EXCLUDE_STRING_TRUE} ${direction}`, () => async () => {
					const files: Dirent[] = [];
					const iterator = crawler
						.down()
						.withDirent()
						.exclude(crawlModuleFilePath)
						.iterator()
						.start(crawlModuleFilePath);

					for await (const item of iterator) {
						files.push(item);
					}
					expect(files).toStrictEqual([]);
				});
			} else {
				it(`${type} ${CRAWL_EXCLUDE_STRING_TRUE} ${direction}`, async () => {
					const files =
						type === 'async'
							? await crawler
									.down()
									.withDirent()
									.exclude(crawlModuleFilePath)
									.async()
									.start(crawlModuleFilePath)
							: crawler
									.down()
									.withDirent()
									.exclude(crawlModuleFilePath)
									.sync()
									.start(crawlModuleFilePath);
					expect(files).toStrictEqual([]);
				});
			}
		});
	});

	const CRAWL_EXCLUDE_FN_FALSE = 'should exclude folder with fn returning false';
	describe.each(directions)(CRAWL_EXCLUDE_FN_FALSE, direction => {
		describe.each(apiTypes)(`${CRAWL_EXCLUDE_FN_FALSE} ${direction}`, type => {
			if (type === 'stream') {
				it(`${type} ${CRAWL_EXCLUDE_FN_FALSE} ${direction}`, () =>
					new Promise<void>(done => {
						const files: (Dirent | string)[] = [];
						const stream = crawler
							.down()
							.withDirent()
							.exclude(() => true)
							.stream()
							.start(crawlModuleFilePath);
						stream.on('data', d => files.push(d as string));
						stream.on('end', () => {
							expect(files).toStrictEqual([]);
							done();
						});
					}));
			} else if (type === 'iterator') {
				it(`${type} ${CRAWL_EXCLUDE_FN_FALSE} ${direction}`, () => async () => {
					const files: Dirent[] = [];
					const iterator = crawler
						.down()
						.withDirent()
						.exclude(() => true)
						.iterator()
						.start(crawlModuleFilePath);

					for await (const item of iterator) {
						files.push(item);
					}
					expect(files).toStrictEqual([]);
				});
			} else {
				it(`${type} ${CRAWL_EXCLUDE_FN_FALSE} ${direction}`, async () => {
					const files =
						type === 'async'
							? await crawler
									.down()
									.withDirent()
									.exclude(() => true)
									.async()
									.start(crawlModuleFilePath)
							: crawler
									.down()
									.withDirent()
									.exclude(() => true)
									.sync()
									.start(crawlModuleFilePath);
					expect(files).toStrictEqual([]);
				});
			}
		});
	});

	const CRAWL_EXCLUDE_FN_TRUE = 'should exclude folder with fn returning true';
	describe.each(directions)(CRAWL_EXCLUDE_FN_TRUE, direction => {
		describe.each(apiTypes)(`${CRAWL_EXCLUDE_FN_TRUE} ${direction}`, type => {
			if (type === 'stream') {
				it(`${type} ${CRAWL_EXCLUDE_FN_TRUE} ${direction}`, () =>
					new Promise<void>(done => {
						const files: (Dirent | string)[] = [];
						const stream = crawler
							.down()
							.withDirent()
							.exclude(() => false)
							.stream()
							.start(crawlModuleFilePath);
						stream.on('data', d => files.push(d as string));
						stream.on('end', () => {
							expect(files).toMatchSnapshot();
							done();
						});
					}));
			} else if (type === 'iterator') {
				it(`${type} ${CRAWL_EXCLUDE_FN_TRUE} ${direction}`, () => async () => {
					const files: Dirent[] = [];
					const iterator = crawler
						.down()
						.withDirent()
						.exclude(() => false)
						.iterator()
						.start(crawlModuleFilePath);

					for await (const item of iterator) {
						files.push(item);
					}
					expect(files).toMatchSnapshot();
				});
			} else {
				it(`${type} ${CRAWL_EXCLUDE_FN_TRUE} ${direction}`, async () => {
					const files =
						type === 'async'
							? await crawler
									.down()
									.withDirent()
									.exclude(() => false)
									.async()
									.start(crawlModuleFilePath)
							: crawler
									.down()
									.withDirent()
									.exclude(() => false)
									.sync()
									.start(crawlModuleFilePath);
					expect(files).toMatchSnapshot();
				});
			}
		});
	});
});
