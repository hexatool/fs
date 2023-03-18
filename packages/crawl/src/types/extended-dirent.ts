import type { Dirent } from 'node:fs';

export class ExtendedDirent {
	readonly name: string;
	readonly path?: string;
	readonly type?: 1 | 2 | undefined;

	constructor(dir: Dirent);
	constructor(path: string, name: string, type?: 1 | 2 | undefined);
	constructor(dir: Dirent | string, name?: string, type?: 1 | 2) {
		if (typeof dir === 'string') {
			this.type = type;
			this.name = name ?? '';
			this.path = dir;
		} else {
			this.name = dir.name;
			this.type = dir.isFile() ? 1 : dir.isDirectory() ? 2 : undefined;
		}
	}

	isDirectory(): boolean {
		return this.type === 2;
	}

	isFile(): boolean {
		return this.type === 1;
	}
}
