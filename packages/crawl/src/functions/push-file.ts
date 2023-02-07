import type { FilterPredicate, Options } from '../options';

export type PushFileFunction = (
	directoryPath: string,
	paths: string[],
	filters?: FilterPredicate[]
) => void;

const pushFileFilter: PushFileFunction = (filename, paths, filters) => {
	if (!filters) {
		return;
	}
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

export default function (options: Options): PushFileFunction {
	const { excludeFiles, filters } = options;
	if (excludeFiles) {
		return empty;
	}

	if (filters && filters.length) {
		return pushFileFilter;
	}

	return pushFile;
}
