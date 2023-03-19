import { Readable } from 'node:stream';

import readDirectory from '../fn/read-directory';
import type {
	CallbackReadDirectoryFn,
	CrawlerOptions,
	EmitEvents,
	ResultTypeOutput,
	SyncReadDirectory,
} from '../types';

export class FileSystemStreamCrawler<Output extends ResultTypeOutput> {
	public readonly stream: Readable;
	private readonly buffer: Output[];
	private pending: number;
	private readonly queue: string[];
	private readonly readDirectory: CallbackReadDirectoryFn<Output>;
	private shouldRead: boolean;

	constructor(path: string, options: CrawlerOptions) {
		this.buffer = [];
		this.pending = 0;
		this.shouldRead = true;
		this.queue = [path];
		this.readDirectory = readDirectory('callback', options) as SyncReadDirectory<Output>;

		this.stream = new Readable({ objectMode: true });
		this.stream._read = () => {
			this.shouldRead = true;

			if (this.buffer.length > 0) {
				this.pushFromBuffer();
			}

			if (this.queue.length > 0) {
				this.readNextDirectory();
			}

			this.checkForEOF();
		};
	}

	private checkForEOF() {
		if (this.buffer.length === 0 && this.pending === 0 && this.queue.length === 0) {
			// There's no more stuff!
			this.stream.push(null);
		}
	}

	private emit(eventName: 'error', data: unknown): void;

	private emit(eventName: EmitEvents, data: Output | unknown): void {
		const stream = this.stream;

		try {
			stream.emit(eventName, data);
		} catch (err) {
			if (eventName === 'error') {
				throw err;
			} else {
				stream.emit('error', err);
			}
		}
	}

	private finishedReadingDirectory() {
		this.pending--;

		if (this.shouldRead) {
			if (this.queue.length > 0) {
				this.readNextDirectory();
			}

			this.checkForEOF();
		}
	}

	private processItem(item: Output) {
		this.pushOrBuffer(item);
	}

	private pushFromBuffer() {
		const stream = this.stream;
		const chunk = this.buffer.shift()!;

		try {
			this.shouldRead = stream.push(chunk);
		} catch (err) {
			this.emit('error', err);
		}
	}

	private pushOrBuffer(chunk: Output) {
		this.buffer.push(chunk);
		if (this.shouldRead) {
			this.pushFromBuffer();
		}
	}

	private readNextDirectory() {
		const path = this.queue.shift()!;
		this.pending++;

		this.readDirectory(path, (err, files) => {
			if (err) {
				this.emit('error', err);
				this.finishedReadingDirectory();

				return;
			}
			if (!files) {
				this.finishedReadingDirectory();

				return;
			}

			try {
				for (const file of files) {
					this.processItem(file);
				}
				this.finishedReadingDirectory();
			} catch (err2) {
				this.emit('error', err2);
				this.finishedReadingDirectory();
			}
		});
	}
}