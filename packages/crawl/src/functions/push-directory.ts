import type { CrawlerOptions, FilterPredicate } from '../options';

export type PushDirectoryFunction = (
	directoryPath: string,
	paths: string[],
	filters: FilterPredicate[]
) => void;

const pushDirectory: PushDirectoryFunction = (directoryPath, paths) => {
	paths.push(directoryPath);
};

const pushDirectoryFilter: PushDirectoryFunction = (directoryPath, paths, filters) => {
	if (filters.every(filter => filter(directoryPath, true))) {
		paths.push(directoryPath);
	}
};

const empty: PushDirectoryFunction = () => {
	return;
};

export default function (options: CrawlerOptions): PushDirectoryFunction {
	const { includeDirs, filters } = options;
	if (!includeDirs) {
		return empty;
	}

	return filters.length ? pushDirectoryFilter : pushDirectory;
}
