import type { Dirent } from 'node:fs';
import type { Readable } from 'node:stream';

import type { Crawler } from './index';

export default interface Builder<O = Dirent | string> {
	async(): Crawler<Promise<O[]>>;
	iterator(): Crawler<AsyncIterableIterator<O>>;
	stream(): Crawler<Readable>;
	sync(): Crawler<O[]>;
}
