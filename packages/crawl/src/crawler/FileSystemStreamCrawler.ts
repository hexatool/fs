import type { Dirent } from 'node:fs';
import { Readable } from 'node:stream';

import type { PathLike } from 'fs';

import type { CallbackReadDirFn } from '../fn/read-dir';
import readDirFn from '../fn/read-dir';
import type { CallBack, EmitEvents } from '../types';

export abstract class FileSystemStreamCrawler<Output extends Dirent | string> {
	public readonly stream: Readable;
	private readonly buffer: (Dirent | string)[];
	private pending: number;
	private readonly queue: PathLike[];
	private shouldRead: boolean;

	protected constructor(path: PathLike) {
		this.buffer = [];
		this.pending = 0;
		this.shouldRead = true;
		this.queue = [path];

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

	private processItem(item: Dirent | string) {
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

	private pushOrBuffer(chunk: Dirent | string) {
		this.buffer.push(chunk);
		if (this.shouldRead) {
			this.pushFromBuffer();
		}
	}

	private readNextDirectory() {
		const path = this.queue.shift()!;
		this.pending++;

		this.readdir(path, (err, files) => {
			if (err) {
				this.emit('error', err);
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

	protected abstract readdir(path: PathLike, callback: CallBack<Output[]>): void;
}

export class DirentFileSystemStreamCrawler extends FileSystemStreamCrawler<Dirent> {
	private readonly readDirFn: CallbackReadDirFn<Dirent>;
	constructor(path: PathLike) {
		super(path);
		this.readDirFn = readDirFn('callback', 'Dirent');
	}

	protected readdir(path: PathLike, callback: CallBack<Dirent[]>): void {
		this.readDirFn(path, callback);
	}
}

export class StringFileSystemStreamCrawler extends FileSystemStreamCrawler<string> {
	private readonly readDirFn: CallbackReadDirFn<string>;
	constructor(path: PathLike) {
		super(path);
		this.readDirFn = readDirFn('callback', 'string');
	}

	protected readdir(path: PathLike, callback: CallBack<string[]>): void {
		this.readDirFn(path, callback);
	}
}