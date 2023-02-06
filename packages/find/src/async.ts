import type { ResultCallback } from './crawler';
import { Crawler } from './crawler';
import type { Options } from './options';

export default async function async(root: string, options: Options): Promise<string[]> {
	return new Promise<string[]>((resolve, reject) => {
		callback(root, options, (err, output) => {
			if (err) {
				reject(err);

				return;
			}
			resolve(output);
		});
	});
}

function callback(root: string, options: Options, callback: ResultCallback) {
	const walker = new Crawler(root, options, callback);
	walker.start(root, options.maxDepth ?? Infinity);
}
