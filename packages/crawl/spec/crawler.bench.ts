import { fdir as Fdir } from 'fdir';
import { bench, describe } from 'vitest';

import crawler from '../src/builder';

describe('crawl down a single depth directory', () => {
	bench(
		'@hexatool/fs-crawl/sync',
		() =>
			new Promise(done => {
				crawler.string().sync(process.cwd());
				done();
			})
	);
	bench(
		'@hexatool/fs-crawl/async',
		() =>
			new Promise((done, reject) => {
				crawler
					.string()
					.async(process.cwd())
					.then(() => done())
					.catch(e => reject(e));
			})
	);
	bench(
		'@hexatool/fs-crawl/stream',
		() =>
			new Promise(done => {
				const stream = crawler.string().stream(process.cwd());
				stream.on('end', () => done());
				stream.resume();
			})
	);
	bench(
		'fdir/async',
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
	bench(
		'fdir/sync',
		() =>
			new Promise(done => {
				new Fdir().withMaxDepth(0).withDirs().crawl(process.cwd()).sync();
				done();
			})
	);
});
