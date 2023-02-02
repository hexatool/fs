import type {
	CommonOptions,
	GroupOptions,
	GroupOutput,
	OnlyCountOptions,
	OnlyCountsOutput,
	Options,
	Output,
	PathsOutput,
} from './types';

export default async function find(path: string, options: GroupOptions): Promise<GroupOutput>;
export default async function find(
	path: string,
	options: OnlyCountOptions
): Promise<OnlyCountsOutput>;
export default async function find(path: string, options: CommonOptions): Promise<PathsOutput>;
export default async function find(path: string, options: Options): Promise<Output> {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (options && 'group' in options && options.group) {
		return [];
	}

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (options && 'onlyCounts' in options && options.onlyCounts) {
		return {
			directories: 0,
			files: 0,
		};
	}

	return [path];
}
