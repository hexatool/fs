import type { Readable } from 'node:stream';

import * as console from 'console';
import { describe, expect, it } from 'vitest';

import type { ApiType, CrawlDirection, LowerCaseResultType, ResultTypeOutput } from '../src/types';
import { apiTypes, directions, lowerCaseResultTypes } from '../src/types';

type ReturnType = ResultTypeOutput[];
type TestFn = (resultType: LowerCaseResultType, direction: CrawlDirection, api: ApiType) => unknown;

interface FactoryOptions {
	length?: number;
	log?: boolean;
	matchEmpty?: boolean;
	matchSnapshot?: boolean;
}

function check(files: ReturnType, { matchSnapshot, matchEmpty, length }: FactoryOptions) {
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

	if (length) {
		expect(files.length).toBe(length);
	}
}

export default function crawlerTest(
	testName: string,
	fn: TestFn,
	options: FactoryOptions = {}
): void {
	describe.each(directions)(testName, direction => {
		describe.each(lowerCaseResultTypes)(`${testName} ${direction}`, resultType => {
			describe.each(apiTypes)(`${testName} ${resultType} ${direction}`, type => {
				const composedTestName = `[${type}] ${testName} ${resultType} ${direction}`;
				if (type === 'stream') {
					it(
						composedTestName,
						() =>
							new Promise<void>((resolve, reject) => {
								const files: ResultTypeOutput[] = [];
								const st = fn(resultType, direction, type) as Readable;
								st.on('data', d => files.push(d as string));
								st.on('end', () => {
									if (options.log) {
										console.log(composedTestName, files);
									}
									try {
										check(files, options);
										resolve();
									} catch (e) {
										reject(e);
									}
								});
							})
					);
				} else if (type === 'iterator') {
					it(composedTestName, async () => {
						const files: ReturnType = [];
						const it = fn(
							resultType,
							direction,
							type
						) as AsyncIterableIterator<ResultTypeOutput>;
						for await (const item of it) {
							files.push(item);
						}
						if (options.log) {
							console.log(composedTestName, files);
						}
						check(files, options);
					});
				} else if (type === 'sync') {
					it(composedTestName, () => {
						const files = fn(resultType, direction, type) as ReturnType;
						if (options.log) {
							console.log(composedTestName, files);
						}
						check(files, options);
					});
				} else {
					it(composedTestName, async () => {
						const files = await (fn(
							resultType,
							direction,
							type
						) as Promise<ReturnType>);
						if (options.log) {
							console.log(composedTestName, files);
						}
						check(files, options);
					});
				}
			});
		});
	});
}
