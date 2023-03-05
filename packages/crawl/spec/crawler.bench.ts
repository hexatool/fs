import { fdir as Fdir } from 'fdir';
import { bench, describe } from 'vitest';

import crawler from '../src/builder';

describe('crawl down a single depth directory', () => {
	bench(
		'@hexatool/fs-crawl/sync',
		() =>
			new Promise(done => {
				crawler.down().sync(process.cwd());
				done();
			})
	);
	bench(
		'@hexatool/fs-crawl/async',
		() =>
			new Promise((done, reject) => {
				crawler
					.down()
					.async(process.cwd())
					.then(() => done())
					.catch(e => reject(e));
			})
	);
	bench(
		'@hexatool/fs-crawl/stream',
		() =>
			new Promise(done => {
				const stream = crawler.down().stream(process.cwd());
				stream.on('end', () => done());
				stream.resume();
			})
	);
	bench(
		'fdir',
		() =>
			new Promise((done, reject) => {
				new Fdir()
					.withMaxDepth(0)
					.withDirs()
					.crawl(process.cwd())
					.withPromise()
					.then(() => done())
					.catch(e => reject(e));
			})
	);
});
