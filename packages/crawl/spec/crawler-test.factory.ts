import type { Dirent } from 'node:fs';
import type { Readable } from 'node:stream';

import { describe, expect, it } from 'vitest';

import { apiTypes, directions } from '../src/types';
import type { ResultTypeOutput } from '../src/types/options';

type ReturnType = ResultTypeOutput[];
type StreamTestFn = () => Readable;
type IteratorTestFn = () => AsyncIterableIterator<ResultTypeOutput>;
type SyncTestFn = () => ReturnType;
type AsyncTestFn = () => Promise<ReturnType>;

function check(files: ReturnType, matchSnapshot: boolean, matchEmpty: boolean) {
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
export default function crawlerTest(
	testName: string,
	sync?: SyncTestFn,
	async?: AsyncTestFn,
	stream?: StreamTestFn,
	iterator?: IteratorTestFn,
	matchSnapshot = false,
	matchEmpty = false
): void {
	describe.each(directions)(testName, direction => {
		describe.each(apiTypes)(`${testName} ${direction}`, type => {
			if (type === 'stream' && stream) {
				it(`[${type}] ${testName} ${direction}`, () =>
					new Promise<void>(resolve => {
						const files: (Dirent | string)[] = [];
						const st = stream();
						st.on('data', d => files.push(d as string));
						st.on('end', () => {
							check(files, matchSnapshot, matchEmpty);
							resolve();
						});
					}));
			} else if (type === 'iterator' && iterator) {
				it(`[${type}] ${testName} ${direction}`, async () => {
					const files: ReturnType = [];
					const it = iterator();
					for await (const item of it) {
						files.push(item);
					}
					check(files, matchSnapshot, matchEmpty);
				});
			} else if (type === 'sync' && sync) {
				it(`[${type}] ${testName} ${direction}`, () => {
					const files = sync();
					check(files, matchSnapshot, matchEmpty);
				});
			} else if (async) {
				it(`[${type}] ${testName} ${direction}`, async () => {
					const files = await async();
					check(files, matchSnapshot, matchEmpty);
				});
			}
		});
	});
}
