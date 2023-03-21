import klaw from 'klaw';
import readdir from 'readdir-enhanced';
import { bench, describe } from 'vitest';

import crawler from '../src/builder';

describe('stream', () => {
	bench(
		'@hexatool/fs-crawl',
		() =>
			new Promise(done => {
				const stream = crawler.string().stream(process.cwd());
				stream.on('end', () => done());
				stream.resume();
			})
	);
	bench(
		'klaw',
		() =>
			new Promise(done => {
				const stream = klaw(process.cwd(), {
					depthLimit: 0,
				});
				stream.on('end', () => done());
				stream.resume();
			})
	);
	bench(
		'readdir',
		() =>
			new Promise(done => {
				const stream = readdir.stream(process.cwd(), {
					deep: 0,
				});
				stream.on('end', () => done());
				stream.resume();
			})
	);
});
