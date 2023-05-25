import { join } from 'node:path';

import readDirent from '../fn/read-dirent';
import type {
	CallbackReadDirectoryFn,
	Crawler,
	CrawlerOptions,
	ResultTypeOutput,
	SyncReadDirectory,
} from '../types';
import { ExtendedDirent } from '../types';

export abstract class AsyncCrawler<Output extends ResultTypeOutput>
	implements Crawler<Promise<Output[]>>
{
	protected readonly readDirent: CallbackReadDirectoryFn<ExtendedDirent>;

	constructor(protected readonly options: CrawlerOptions) {
		this.readDirent = readDirent('callback', options) as SyncReadDirectory<ExtendedDirent>;
	}

	abstract start(path: string): Promise<Output[]>;
}

export class DownAsyncCrawler<Output extends ResultTypeOutput> extends AsyncCrawler<Output> {
	async start(path: string): Promise<Output[]> {
		return new Promise<ExtendedDirent[]>((resolve, reject) => {
			this.readDirent(path, (error, result) => {
				if (error) {
					reject(error);
				} else {
					resolve(result ?? []);
				}
			});
		})
			.then(dirent => {
				const dirs = dirent.filter(d => d.isDirectory());

				const mapped =
					this.options.returnType === 'string'
						? (dirent.map(dir =>
								dir.path ? join(dir.path, dir.name) : dir.name
						  ) as Output[])
						: (dirent as Output[]);

				const promises = [
					Promise.resolve(mapped),
					...dirs.map(dir => this.start(join(path, dir.name))),
				];

				return Promise.all(promises);
			})
			.then(arr => arr.flat());
	}
}
