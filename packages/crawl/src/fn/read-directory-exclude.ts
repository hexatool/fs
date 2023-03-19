import type { ExtendedDirent, ReadDirectory } from '../types';
import type { ExcludeType } from '../types/options';
import matchDirectory from './match-directory';

export default function readDirectoryExclude(
	fn: ReadDirectory<ExtendedDirent>,
	exclude?: ExcludeType
): ReadDirectory<ExtendedDirent> {
	if (exclude) {
		const match = matchDirectory(exclude);

		return (path, callback) => {
			const ex = match(path);
			if (ex) {
				if (callback) {
					callback(undefined, []);

					return;
				}

				return [];
			}

			return fn(path, callback);
		};
	}

	return fn;
}
