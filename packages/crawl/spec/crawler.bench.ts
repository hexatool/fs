import { fdir as Fdir } from 'fdir';
import { bench, describe } from 'vitest';

import crawler from '../src/sync';

describe('[ASYNC] crawl down single depth directory', () => {
	bench('@hexatool/fs-crawl/sync', () => {
		crawler.down().sync().start();
	});
	bench(
		'@hexatool/fs-crawl/async',
		() =>
			new Promise((done, reject) => {
				crawler
					.down()
					.async()
					.start()
					.then(() => done())
					.catch(e => reject(e));
			})
	);
	bench(
		'@hexatool/fs-crawl/stream',
		() =>
			new Promise(done => {
				const stream = crawler.down().stream().start();
				stream.on('end', () => done());
				stream.resume();
			})
	);
	bench(
		'fdir',
		async () =>
			void (await new Fdir().withMaxDepth(1).withDirs().crawl(process.cwd()).withPromise())
	);
});
