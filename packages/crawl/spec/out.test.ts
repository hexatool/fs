import * as console from 'console';
import { fdir as Fdir } from 'fdir';
import { describe, it } from 'vitest';

import crawler from '../src/builder';

describe('async crawl down single depth directory', () => {
	it('@hexatool/fs-crawl/sync', () =>
		new Promise(done => {
			const files = crawler.down().sync().start(process.cwd());
			console.log(files);
			done(undefined);
		}));
	it('@hexatool/fs-crawl/async', () =>
		new Promise((done, reject) => {
			crawler
				.down()
				.async()
				.start(process.cwd())
				.then(f => console.log(f))
				.then(() => done(undefined))
				.catch(e => reject(e));
		}));
	it('@hexatool/fs-crawl/stream', () =>
		new Promise(done => {
			// @ts-ignore
			const files = [];
			const stream = crawler.down().stream().start(process.cwd());
			stream.on('data', f => files.push(f));
			stream.on('end', () => {
				// @ts-ignore
				console.log(files);
				done(undefined);
			});
			stream.resume();
		}));
	it('fdir', () =>
		new Promise((done, reject) => {
			new Fdir()
				.withMaxDepth(0)
				.withDirs()
				.crawl(process.cwd())
				.withPromise()
				.then(f => console.log(f))
				.then(() => done(undefined))
				.catch(e => reject(e));
		}));
});
