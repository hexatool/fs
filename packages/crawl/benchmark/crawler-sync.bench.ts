import { fdir as Fdir } from 'fdir';
import klawS from 'klaw-sync';
import readdir from 'readdir-enhanced';
import { bench, describe } from 'vitest';

import crawler from '../src/builder';

describe('sync', () => {
	bench(
		'@hexatool/fs-crawl',
		() =>
			new Promise(done => {
				crawler.string().sync(process.cwd());
				done();
			})
	);
	bench(
		'fdir',
		() =>
			new Promise(done => {
				new Fdir().withMaxDepth(0).withDirs().crawl(process.cwd()).sync();
				done();
			})
	);
	bench(
		'klaw',
		() =>
			new Promise(done => {
				klawS(process.cwd(), {
					depthLimit: 0,
				});
				done();
			})
	);
	bench(
		'readdir',
		() =>
			new Promise(done => {
				readdir.sync(process.cwd(), {
					deep: 0,
				});
				done();
			})
	);
});
