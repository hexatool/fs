import { bench, describe } from 'vitest';

import crawler from '../src/builder';

describe('crawl down a single depth directory', () => {
	bench(
		'string',
		() =>
			new Promise(done => {
				const stream = crawler.down().stream(process.cwd());
				stream.on('end', () => done());
				stream.resume();
			})
	);
	bench(
		'Dirent',
		() =>
			new Promise(done => {
				const stream = crawler.down().stream(process.cwd());
				stream.on('end', () => done());
				stream.resume();
			})
	);
});
