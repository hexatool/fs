import { fdir as Fdir } from 'fdir';
import readdir from 'readdir-enhanced';
import { bench, describe } from 'vitest';

import crawler from '../src/builder';

describe('async', () => {
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
		'readdir/async',
		() =>
			new Promise((done, reject) => {
				readdir
					.async(process.cwd(), {
						deep: 0,
					})
					.then(() => done())
					.catch(e => reject(e));
			})
	);
});
