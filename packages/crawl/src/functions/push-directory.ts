import type { FilterPredicate, Options } from '../options';

export type PushDirectoryFunction = (
	directoryPath: string,
	paths: string[],
	filters?: FilterPredicate[]
) => void;

const pushDirectory: PushDirectoryFunction = (directoryPath, paths) => {
	paths.push(directoryPath);
};

const pushDirectoryFilter: PushDirectoryFunction = (directoryPath, paths, filters) => {
	if (!filters) {
		return;
	}
	if (filters.every(filter => filter(directoryPath, true))) {
		paths.push(directoryPath);
	}
};

const empty: PushDirectoryFunction = () => {
	return;
};

export default function (options: Options): PushDirectoryFunction {
	const { includeDirs, filters } = options;
	if (!includeDirs) {
		return empty;
	}

	return filters && filters.length ? pushDirectoryFilter : pushDirectory;
}