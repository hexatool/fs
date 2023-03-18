import { resolve } from 'node:path';

import type { CrawlerOptions, ResultTypeOutput } from '../types';
import { ExtendedDirent } from '../types';
import type { ReadDirectory } from './read-directory';

function absoluteString(
	api: 'callback' | 'sync',
	fn: ReadDirectory<string>
): ReadDirectory<string> {
	if (api === 'callback') {
		return (path, callback) => {
			const absolutePath = resolve(path);
			fn(absolutePath, (err, result) => {
				if (err) {
					callback!(err, []);
				} else {
					callback!(
						null,
						result.map(p => resolve(absolutePath, p))
					);
				}
			});
		};
	}

	return (path: string) => {
		const absolutePath = resolve(path);
		const files = fn(absolutePath) ?? [];

		return files.map(p => resolve(absolutePath, p));
	};
}

function absoluteDirent(
	api: 'callback' | 'sync',
	fn: ReadDirectory<ExtendedDirent>
): ReadDirectory<ExtendedDirent> {
	if (api === 'callback') {
		return (path, callback) => {
			const absolutePath = resolve(path);
			fn(absolutePath, (err, result) => {
				if (err) {
					callback!(err, []);
				} else {
					callback!(
						null,
						result.map(p => new ExtendedDirent(absolutePath, p.name, p.type))
					);
				}
			});
		};
	}

	return (path: string) => {
		const absolutePath = resolve(path);
		const files = fn(absolutePath) ?? [];

		return files.map(p => new ExtendedDirent(absolutePath, p.name, p.type));
	};
}

export default function pathReadDirectory(
	api: 'callback' | 'sync',
	fn: ReadDirectory<ResultTypeOutput>,
	options: CrawlerOptions
): ReadDirectory<ResultTypeOutput> {
	const { pathType, returnType } = options;
	if (pathType === 'absolute' && returnType === 'string') {
		return absoluteString(api, fn as ReadDirectory<string>);
	}
	if (pathType === 'absolute' && returnType === 'Dirent') {
		return absoluteDirent(api, fn as ReadDirectory<ExtendedDirent>);
	}

	return fn;
}
