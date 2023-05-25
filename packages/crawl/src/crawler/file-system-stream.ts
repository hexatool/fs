import { join } from 'node:path';
import { Readable } from 'node:stream';

import readDirent from '../fn/read-dirent';
import type {
	CallbackReadDirectoryFn,
	CrawlerOptions,
	EmitEvents,
	ResultTypeOutput,
	SyncReadDirectory,
} from '../types';
import { ExtendedDirent } from '../types';

export class FileSystemStreamCrawler<Output extends ResultTypeOutput> {
	public readonly stream: Readable;
	private readonly buffer: Output[];
	private pending: number;
	private readonly queue: string[];
	private readonly readDirent: CallbackReadDirectoryFn<ExtendedDirent>;
	private shouldRead: boolean;

	constructor(path: string, private readonly options: CrawlerOptions) {
		this.buffer = [];
		this.pending = 0;
		this.shouldRead = true;
		this.queue = [path];
		this.readDirent = readDirent('callback', options) as SyncReadDirectory<ExtendedDirent>;

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

	private processItem(item: ExtendedDirent) {
		if (this.options.returnType === 'string') {
			const p = item.path ? join(item.path, item.name) : item.name;
			this.pushOrBuffer(p as Output);

			return;
		}

		this.pushOrBuffer(item as Output);
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

		this.readDirent(path, (err, files) => {
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
				for (const dir of files) {
					this.processItem(dir);
					if (dir.isDirectory()) {
						this.queue.push(join(path, dir.name));
					}
				}
				this.finishedReadingDirectory();
			} catch (err2) {
				this.emit('error', err2);
				this.finishedReadingDirectory();
			}
		});
	}
}
