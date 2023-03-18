import type { Dirent } from 'node:fs';

export class ExtendedDirent {
	readonly name: string;
	private readonly type?: number | undefined;

	constructor(dir: Dirent) {
		this.name = dir.name;
		this.type = dir.isFile() ? 1 : dir.isDirectory() ? 2 : undefined;
	}

	isDirectory(): boolean {
		return this.type === 2;
	}

	isFile(): boolean {
		return this.type === 1;
	}
}
