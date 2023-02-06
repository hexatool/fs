import { Crawler } from './crawler';
import type { Options } from './options';

export default function find(root: string, options: Options): string[] | undefined {
	const walker = new Crawler(root, options);

	return walker.start(root, options.maxDepth ?? Infinity);
}
