import type { Dirent } from 'node:fs';

import * as process from 'process';

import type { Crawler } from '../types';
import type { Pending } from '../utils/pending';
import { pending } from '../utils/pending';
import {
	DirentFileSystemStreamCrawler,
	FileSystemStreamCrawler,
	StringFileSystemStreamCrawler,
} from './FileSystemStreamCrawler';

abstract class IteratorCrawler<T extends Dirent | string>
	implements Crawler<AsyncIterableIterator<T>>
{
	start(path = process.cwd()): AsyncIterableIterator<T> {
		const stream = new StringFileSystemStreamCrawler(path).stream;
		const pendingValues: T[] = [];
		const pendingReads: Array<Pending<IteratorResult<T>>> = [];
		let error: Error | undefined;
		let readable = false;
		let done = false;

		stream.on('error', function streamError(err: Error) {
			error = err;
			stream.pause();
			fulfillPendingReads();
		});

		stream.on('end', function streamEnd() {
			done = true;
			fulfillPendingReads();
		});

		stream.on('readable', function streamReadable() {
			readable = true;
			fulfillPendingReads();
		});

		function fulfillPendingReads() {
			if (error) {
				while (pendingReads.length > 0) {
					const pendingRead = pendingReads.shift()!;
					pendingRead.reject(error);
				}
			} else if (pendingReads.length > 0) {
				while (pendingReads.length > 0) {
					const pendingRead = pendingReads.shift()!;
					const value = getNextValue();

					if (value) {
						pendingRead.resolve({ value });
					} else if (done) {
						pendingRead.resolve({ done, value });
					} else {
						pendingReads.unshift(pendingRead);
						break;
					}
				}
			}
		}

		function getNextValue(): T | undefined {
			let value = pendingValues.shift();
			if (value) {
				return value;
			}
			if (readable) {
				readable = false;

				// eslint-disable-next-line no-constant-condition
				while (true) {
					value = stream.read() as T | undefined;
					if (value) {
						pendingValues.push(value);
					} else {
						break;
					}
				}

				return pendingValues.shift();
			}

			return undefined;
		}

		return {
			[Symbol.asyncIterator]() {
				return this;
			},

			async next() {
				const pendingRead = pending<IteratorResult<T>>();
				pendingReads.push(pendingRead);

				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				Promise.resolve().then(fulfillPendingReads);

				return pendingRead.promise;
			},
		};
	}

	abstract getStream(path: string): FileSystemStreamCrawler<T>;
}

export class StringIteratorCrawler extends IteratorCrawler<string> {
	getStream(path: string): FileSystemStreamCrawler<string> {
		return new StringFileSystemStreamCrawler(path);
	}
}

export class DirentIteratorCrawler extends IteratorCrawler<Dirent> {
	getStream(path: string): FileSystemStreamCrawler<Dirent> {
		return new DirentFileSystemStreamCrawler(path);
	}
}
