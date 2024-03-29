import type { CrawlerOptions, FilterPredicate } from '../options';

export type PushFileFunction = (
	directoryPath: string,
	paths: string[],
	filters: FilterPredicate[]
) => void;

const pushFileFilter: PushFileFunction = (filename, paths, filters) => {
	if (filters.every(filter => filter(filename, false))) {
		paths.push(filename);
	}
};

const pushFile: PushFileFunction = (filename, paths) => {
	paths.push(filename);
};

const empty: PushFileFunction = () => {
	return;
};

export default function (options: CrawlerOptions): PushFileFunction {
	const { excludeFiles, filters } = options;
	if (excludeFiles) {
		return empty;
	}

	if (filters.length) {
		return pushFileFilter;
	}

	return pushFile;
}
