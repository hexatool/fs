import { join } from 'node:path';

import readDirent from '../fn/read-dirent';
import type { Crawler, CrawlerOptions, ResultTypeOutput, SyncReadDirectory } from '../types';
import { ExtendedDirent } from '../types';

export abstract class SyncCrawler<Output extends ResultTypeOutput> implements Crawler<Output[]> {
	protected readonly readDirent: SyncReadDirectory<ExtendedDirent>;
	constructor(protected readonly options: CrawlerOptions) {
		this.readDirent = readDirent('sync', options) as SyncReadDirectory<ExtendedDirent>;
	}

	abstract start(path: string): Output[];
}

export class DownSyncCrawler<Output extends ResultTypeOutput> extends SyncCrawler<Output> {
	override start(path: string): Output[] {
		const dirent = this.readDirent(path);
		const subDirents: Output[] = [];
		const dirs = dirent.filter(d => d.isDirectory());
		for (const dir of dirs) {
			const res = this.start(join(path, dir.name));
			subDirents.push(...res);
		}
		if (this.options.returnType === 'string') {
			const mapped = dirent.map(dir =>
				dir.path ? join(dir.path, dir.name) : dir.name
			) as Output[];

			return [...mapped, ...subDirents];
		}

		return [...dirent, ...subDirents] as Output[];
	}
}
