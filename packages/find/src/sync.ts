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

export default function find(path: string, options: GroupOptions): GroupOutput;
export default function find(path: string, options: OnlyCountOptions): OnlyCountsOutput;
export default function find(path: string, options: CommonOptions): PathsOutput;
export default function find(path: string, options: Options): Output {
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
