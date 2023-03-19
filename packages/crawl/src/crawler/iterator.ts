import type { Crawler, CrawlerOptions, ResultTypeOutput } from '../types';
import type { Pending } from '../utils/pending';
import { pending } from '../utils/pending';
import { FileSystemStreamCrawler } from './file-system-stream';

export class IteratorCrawler<Output extends ResultTypeOutput>
	implements Crawler<AsyncIterableIterator<Output>>
{
	constructor(protected readonly options: CrawlerOptions) {}
	start(path: string): AsyncIterableIterator<Output> {
		const stream = new FileSystemStreamCrawler(path, this.options).stream;
		const pendingValues: Output[] = [];
		const pendingReads: Array<Pending<IteratorResult<Output>>> = [];
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

		function getNextValue(): Output | undefined {
			let value = pendingValues.shift();
			if (value) {
				return value;
			}
			if (readable) {
				readable = false;

				do {
					value = stream.read() as Output | undefined;
					if (value) {
						pendingValues.push(value);
					}
				} while (value);

				return pendingValues.shift();
			}

			return undefined;
		}

		return {
			[Symbol.asyncIterator]() {
				return this;
			},

			async next() {
				const pendingRead = pending<IteratorResult<Output>>();
				pendingReads.push(pendingRead);

				fulfillPendingReads();

				return pendingRead.promise;
			},
		};
	}
}
