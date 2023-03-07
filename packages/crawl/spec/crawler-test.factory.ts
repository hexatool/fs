import type { Dirent } from 'node:fs';
import type { Readable } from 'node:stream';

import * as console from 'console';
import { describe, expect, it } from 'vitest';

import { apiTypes, CrawlDirection, directions } from '../src/types';
import type { ResultTypeOutput } from '../src/types/options';

type ReturnType = ResultTypeOutput[];
type StreamTestFn = (direction: CrawlDirection) => Readable;
type IteratorTestFn = (direction: CrawlDirection) => AsyncIterableIterator<ResultTypeOutput>;
type SyncTestFn = (direction: CrawlDirection) => ReturnType;
type AsyncTestFn = (direction: CrawlDirection) => Promise<ReturnType>;

function check(files: ReturnType, matchSnapshot?: boolean, matchEmpty?: boolean) {
	if (matchSnapshot) {
		expect(files).toMatchSnapshot();
	}

	if (matchEmpty) {
		expect(files).toBeDefined();
		expect(files.length).toBe(0);
	} else {
		expect(files).toBeDefined();
		expect(files.length).toBeGreaterThan(0);
		expect(files.every(t => t)).toBeTruthy();
	}
}

interface FactoryOptions {
	log?: boolean;
	matchEmpty?: boolean;
	matchSnapshot?: boolean;
}

export default function crawlerTest(
	testName: string,
	sync?: SyncTestFn,
	async?: AsyncTestFn,
	stream?: StreamTestFn,
	iterator?: IteratorTestFn,
	options?: FactoryOptions
): void {
	describe.each(directions)(testName, direction => {
		describe.each(apiTypes)(`${testName} ${direction}`, type => {
			if (type === 'stream' && stream) {
				it(`[${type}] ${testName} ${direction}`, () =>
					new Promise<void>(resolve => {
						const files: (Dirent | string)[] = [];
						const st = stream(direction);
						st.on('data', d => files.push(d as string));
						st.on('end', () => {
							check(files, options?.matchSnapshot, options?.matchEmpty);
							if (options?.log) {
								console.log(`[${type}] ${testName} ${direction}`, files);
							}
							resolve();
						});
					}));
			} else if (type === 'iterator' && iterator) {
				it(`[${type}] ${testName} ${direction}`, async () => {
					const files: ReturnType = [];
					const it = iterator(direction);
					for await (const item of it) {
						files.push(item);
					}
					check(files, options?.matchSnapshot, options?.matchEmpty);
					if (options?.log) {
						console.log(`[${type}] ${testName} ${direction}`, files);
					}
				});
			} else if (type === 'sync' && sync) {
				it(`[${type}] ${testName} ${direction}`, () => {
					const files = sync(direction);
					check(files, options?.matchSnapshot, options?.matchEmpty);
					if (options?.log) {
						console.log(`[${type}] ${testName} ${direction}`, files);
					}
				});
			} else if (async) {
				it(`[${type}] ${testName} ${direction}`, async () => {
					const files = await async(direction);
					check(files, options?.matchSnapshot, options?.matchEmpty);
					if (options?.log) {
						console.log(`[${type}] ${testName} ${direction}`, files);
					}
				});
			}
		});
	});
}
